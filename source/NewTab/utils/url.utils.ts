function getDomainFromUrl(url: string): string {
  try {
    const urlObj = new URL(url);
    return urlObj.hostname ?? "";
  } catch (error) {
    console.error("Error getting domain from URL", error);

    return "";
  }
}

function getFirstLetterFromDomain(domain: string): string {
  return getDomainFromUrl(domain).charAt(0).toUpperCase() ?? "X";
}

export const urlUtils = {
  getDomainFromUrl,
  getFirstLetterFromDomain,
};
