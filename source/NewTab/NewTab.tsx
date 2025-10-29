import React, { useEffect, useState } from "react";
import { Grid } from "./components/Grid";
import { Bookmark } from "../interfaces/bookmark.inteface";
import { getBookmarksTreeById, getPathToBookmark } from "./utils/bookmarks.utils";

let cache = {}

function NewTab() {
  const [bookmarks, setBookmarks] = useState<Bookmark[]>([]);

  useEffect(() => {
    getBookmarksTreeById("1").then((bookmarks) => {
      setBookmarks(bookmarks);
    });

    getPathToBookmark("448").then((path) => {
      console.log(path);
    });
  }, []);


  return <Grid bookmarks={bookmarks} setBookmarks={setBookmarks}/>;
}

export default NewTab;
