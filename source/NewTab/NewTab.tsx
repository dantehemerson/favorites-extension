import React, { useEffect, useState } from "react";
import { Grid } from "./components/Grid";
import { Bookmark } from "../interfaces/bookmark.inteface";
import {
  getBookmarksTreeById,
  getCurrentFolderId,
  getPathToBookmark,
} from "./utils/bookmarks.utils";
import { FolderBreadcrumbs } from "./components/FolderBreadcrumbs";
import { iconsUtils } from "./utils/icons.utils";

function NewTab() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);
  const [pathToBookmark, setPathToBookmark] = useState<Bookmark[]>([]);

  useEffect(() => {
    console.log("getting bookmarks tree", getCurrentFolderId());

    const initialLoad = async () => {
      const folderId = getCurrentFolderId();

      const [bookmarks, pathToBookmark] = await Promise.all([
        getBookmarksTreeById(folderId),
        getPathToBookmark(folderId),
      ]);

      setBookmarks(bookmarks);
      setPathToBookmark(pathToBookmark);

      const newBookmarksWithIcons = await Promise.all(
        bookmarks.map(async (bookmark) => {
          if (bookmark.type === "bookmark" && bookmark.url) {
            const icon = await iconsUtils.get(bookmark.url!);

            return {
              ...bookmark,
              icon: icon.href,
            };
          }
          return bookmark;
        })
      );

      setBookmarks(newBookmarksWithIcons);
    };

    initialLoad();

    const handleHashChange = () => {
      console.log("hashchange", getCurrentFolderId());
      initialLoad();
    };

    window.addEventListener("hashchange", handleHashChange);

    return () => {
      window.removeEventListener("hashchange", handleHashChange);
    };
  }, []);

  return (
    <>
      <FolderBreadcrumbs path={pathToBookmark} />
      <Grid bookmarks={bookmarks} setBookmarks={setBookmarks} />
    </>
  );
}

export default NewTab;
