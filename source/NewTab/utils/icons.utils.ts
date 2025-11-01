import { IDBPDatabase, openDB } from "idb";
import ColorHash from "color-hash";
import { urlUtils } from "./url.utils";

type PageResponse = {
  body: string;
  isOk: boolean;
  responseUrl: URL;
};

let imagesDB: IDBPDatabase;
let colorHash = new ColorHash({
  lightness: 0.5,
  saturation: 0.54,
});

export async function getImagesDB(): Promise<IDBPDatabase> {
  if (imagesDB) return imagesDB;

  imagesDB = await openDB("favorites-db", 1, {
    upgrade(db) {
      db.createObjectStore("favicons", { keyPath: "url" });
    },
  });

  return imagesDB;
}

async function fetchPage(url: string): Promise<PageResponse> {
  const response = await fetch(url, {
    method: "GET",
    redirect: "follow",
    cache: "no-cache",
    credentials: "omit",
    signal: AbortSignal.timeout(5000),
  });

  return {
    body: await response.text(),
    isOk: response.ok,
    responseUrl: new URL(response.url),
  };
}

async function getIconFromHTML(
  response: PageResponse
): Promise<{ sizes: string; href: string } | undefined> {
  const { body, responseUrl } = response;

  // Regex to match <link> tags with "rel" containing "icon"
  const regex = /<link[^>]*rel=['"]?[^\s]*icon['"]?[^>]*?>/gi;
  const matches = Array.from(body.matchAll(regex));
  const icons: { sizes: string; href: string }[] = [];

  matches.forEach((match) => {
    const linkTag = match[0];

    // Extract href value
    const hrefMatch = linkTag.match(/href=['"]?([^\s>'"]*)['"]?/i);
    const href = hrefMatch ? hrefMatch[1] : null;

    // Extract sizes value
    const sizesMatch = linkTag.match(/sizes=['"]?([^\s>'"]*)['"]?/i);
    const sizes = sizesMatch ? sizesMatch[1] : null;

    if (href) {
      icons.push({
        sizes: sizes || "unknown",
        href:
          href.startsWith("http") || href.startsWith("data:image")
            ? href
            : `${responseUrl.protocol}//${responseUrl.host}${
                /^\/.*/.test(href) ? href : `/${href}`
              }`,
      });
    }
  });

  // Choose the largest icon
  const largerstIcon = icons.reduce((prev, curr) => {
    const prevWidth = (prev?.sizes || "0x0").split("x")[0];
    const currWidth = (curr.sizes || "0x0").split("x")[0];
    return Number(currWidth) > Number(prevWidth) ? curr : prev;
  }, icons[0]);

  return largerstIcon;
}

function generateDefaultIcon(pageUrl: string): { sizes: string; href: string } {
  const textColor = "#ffffff";
  const backgroundColor = colorHash.hsl(pageUrl);

  const firstLetter = urlUtils.getFirstLetterFromDomain(pageUrl);

  const svgContent = `
    <svg width="100" height="100" xmlns="http://www.w3.org/2000/svg">
      <rect width="100%" height="100%" fill="hsl(${backgroundColor[0]}, ${backgroundColor[1]}, ${backgroundColor[2]})"/>
      <text x="50%" y="50%" font-size="48" text-anchor="middle" dominant-baseline="middle" fill="${textColor}">${firstLetter}</text>
    </svg>
  `;

  const base64 = `data:image/svg+xml;base64,${btoa(svgContent)}`;

  return {
    sizes: "100x100",
    href: base64,
  };
}

async function getIcon(pageUrl: string) {
  let icon;

  // Try to get the icon from the page HTML
  try {
    const response = await fetchPage(pageUrl);

    if (!response.isOk) {
      throw new Error("Failed to fetch page");
    }

    icon = await getIconFromHTML(response);
  } catch (error) {
    console.error("Error fetching page", error);
  }

  // If no icon found, generate a default one
  if (!icon) {
    icon = generateDefaultIcon(pageUrl);
  }

  return icon;
}

export const iconsUtils = {
  get: (url: string) => getIcon(url),
  set: (key: string, value: string) => undefined,
};
