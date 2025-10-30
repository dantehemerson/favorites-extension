import browser from "webextension-polyfill";
import { bookmarksUtils } from "./bookmarks.utils";

function openInCurrentTab(url: string) {
  if (url.startsWith("javascript:")) {
    console.warn("Javascript bookmarks are not supported in this tab!");
  } else {
    browser.tabs.update(undefined, { url });
  }
}

async function getCurrentTab(): Promise<browser.Tabs.Tab | undefined> {
  const [currentTab] = await browser.tabs.query({
    active: true,
    currentWindow: true,
  });

  return currentTab ?? undefined;
}

async function openInNewTab(
  urlInput: string | string[],
  active: boolean = false
) {
  const urls = Array.isArray(urlInput) ? urlInput : [urlInput];

  if (!urls.length) return;

  const currentTab = await browserUtils.getCurrentTab();

  const tabs = await browser.tabs.query({
    windowId: browser.windows.WINDOW_ID_CURRENT,
  });

  // Find last child tab opened by current tab (if any)
  let refTab = currentTab;
  for (const tab of tabs) {
    if (tab.openerTabId === currentTab?.id) {
      refTab = tab;
    }
  }

  const refTabIndex = refTab ? refTab.index : tabs.length - 1;

  // Open each URL as a new tab after refTab
  for (let i = 0; i < urls.length; i++) {
    const url = urls[i]!;

    if (bookmarksUtils.isValidBookmarkUrlToOpen(url)) {
      await browser.tabs.create({
        url,
        index: refTabIndex + i + 1,
        active,
        openerTabId: currentTab?.id,
      });
    }
  }
}

function openInNewWindow(url: string | string[]) {}

export const browserUtils = {
  openInCurrentTab,
  openInNewTab,
  openInNewWindow,
  getCurrentTab,
};
