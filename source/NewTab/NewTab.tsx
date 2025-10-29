import React, { useEffect, useState } from "react";
import { Grid } from "./components/Grid";
import { Bookmark } from "../interfaces/bookmark.inteface";
import { getBookmarksTreeById, getCurrentFolderId, getPathToBookmark } from "./utils/bookmarks.utils";

let cache = {}

function NewTab() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  useEffect(() => {
    console.log('getting bookmarks tree', getCurrentFolderId());
    getBookmarksTreeById(getCurrentFolderId()).then((bookmarks) => {
      setBookmarks(bookmarks);
    });

    getPathToBookmark("448").then((path) => {
      console.log(path);
    });

    window.addEventListener('hashchange', () => {
      console.log('hashchange', getCurrentFolderId());
      getBookmarksTreeById(getCurrentFolderId()).then((bookmarks) => {
        setBookmarks(bookmarks);
      });
    });
  }, []);


  return <Grid bookmarks={bookmarks} setBookmarks={setBookmarks}/>;
}

export default NewTab;
