import browser from "webextension-polyfill";
import { Bookmark, BookmarkType } from "../../interfaces/bookmark.inteface";
import querystring from 'query-string'

export function getBookmarkType(
  bookmark: browser.Bookmarks.BookmarkTreeNode
): BookmarkType {
  return !bookmark.url ? "folder" : "bookmark";
}

/**
 * Get the tree of bookmarks for a given bookmark id.
 * It return only 2 levels of the tree. It's useful to show the preview of folders.
 *
 * @param bookmarkId - The id of the bookmark to get the tree for.
 * @returns The tree of bookmarks.
 */
export async function getBookmarksTreeById(
  bookmarkId: string
): Promise<Bookmark[]> {
  try {
    const subtree = await browser.bookmarks.getSubTree(bookmarkId);

    const childrenBookmarks = subtree[0]?.children ?? [];

    return childrenBookmarks.map((bookmark) => ({
      id: bookmark.id ?? "",
      name: bookmark.title ?? "",
      url: bookmark.url,
      parentId: bookmark.parentId,
      type: getBookmarkType(bookmark),
      children: bookmark.children?.map((child) => ({
        id: child.id ?? "",
        name: child.title ?? "",
        url: child.url,
        parentId: child.parentId,
        type: getBookmarkType(child),
      })),
    }));
  } catch (error) {
    console.error("Error getting bookmarks by id", error);

    return [];
  }
}

export async function getBookmarkById(
  bookmarkId: string
): Promise<Bookmark | undefined> {
  try {
    const bookmarkNodes = await browser.bookmarks.get(bookmarkId);

    if (bookmarkNodes && bookmarkNodes.length >= 1) {
      const bookmark = bookmarkNodes[0]!;

      return {
        id: bookmark.id ?? "",
        name: bookmark.title ?? "",
        url: bookmark.url,
        parentId: bookmark.parentId,
        type: getBookmarkType(bookmark),
      };
    } else {
      return undefined;
    }
  } catch (error) {
    console.error("Error getting folder by id", error);

    return undefined;
  }
}

/**
 * Get the path to a bookmark.
 * Used for the breadcrumb navigation.
 *
 * The first item is the root node.
 *
 * @param bookmarkId - The id of the bookmark to get the path to. Usually a folder id.
 * @returns The path to the bookmark.
 */
export async function getPathToBookmark(bookmarkId: string): Promise<Bookmark[]> {
  const path: Bookmark[] = [];
  let currentId: string | undefined = bookmarkId;

  try {
    while (currentId) {
      const bookmark = await getBookmarkById(currentId);
      if (!bookmark) break;

      path.unshift(bookmark);
      currentId = bookmark.parentId;
    }

    return path;
  } catch (err) {
    console.error("Error while getting bookmark path:", err);

    return [];
  }
}

export function getCurrentFolderId() {
  // Get from the URL hash
  let folderId = querystring.parse(location.hash).folderId as string;

  return folderId ?? "1";
}
