import React, { useCallback, useMemo } from "react";
import { ReactSortable } from "react-sortablejs";
import Sortable from "sortablejs";

import { Bookmark } from "../../interfaces/bookmark.inteface";
import MultiDragPro from "../../sortablejs-plugins/MultiDragPro";
import { BookmarkComponent } from "./Bookmark";
import { settingsUtils } from "../utils/settings.utils";
import { browserUtils } from "../utils/browser.utils";
import { bookmarksUtils } from "../utils/bookmarks.utils";

// @ts-ignore
Sortable.mount(new MultiDragPro());

type GridProps = {
  bookmarks: Bookmark[];
  setBookmarks: (bookmarks: Bookmark[]) => void;
};

export function Grid({ bookmarks, setBookmarks }: GridProps) {
  const isAtLeastOneBookmarkSelected = useMemo(() => {
    return bookmarks.some((bookmark) => bookmark.selected);
  }, [bookmarks]);

  const onClickBookmark = useCallback(
    (bookmark: Bookmark, event: React.MouseEvent<HTMLDivElement>) => {
      if (bookmark.type === "bookmark") {
        if (bookmarksUtils.isValidBookmarkUrlToOpen(bookmark.url)) {
          if (event.ctrlKey || event.metaKey) {
            if (!isAtLeastOneBookmarkSelected)
              browserUtils.openInNewTab(bookmark.url!);
          } else if (event.shiftKey) {
            if (!isAtLeastOneBookmarkSelected)
              browserUtils.openInNewWindow(bookmark.url!);
          } else {
            if (settingsUtils.get("open-bookmarks-in-new-tab")) {
              browserUtils.openInNewTab(bookmark.url!, true);
            } else {
              browserUtils.openInCurrentTab(bookmark.url!);
            }
          }
        }
      } else {
        const isSelectKeyPressed =
          event.ctrlKey || event.metaKey || event.shiftKey;

        const shouldSkipRedirectToSelect =
          isSelectKeyPressed && isAtLeastOneBookmarkSelected;

        if (shouldSkipRedirectToSelect) {
          return;
        }

        location.hash = `#folderId=${bookmark.id}`;
      }
    },
    [isAtLeastOneBookmarkSelected]
  );

  const onAuxClickBookmark = useCallback((bookmark: Bookmark) => {
    if (bookmark.type === "bookmark") {
      if (bookmark.url) {
        browserUtils.openInNewTab(bookmark.url);
      }
    }
  }, []);

  return (
    <ReactSortable
      multiDrag={true}
      selectedClass="sortable-grid-selected-class"
      list={bookmarks}
      id="grid-container"
      setList={setBookmarks}
      className="text-center"
      swapThreshold={1}
      animation={150}
      // onMove={(evt: any) => {
      //   const target = evt.related;
      //   // Pointer position:
      //   console.log(
      //     "Pointer position: ",
      //     evt.originalEvent.clientX,
      //     evt.originalEvent.clientY
      //   );

      //   if (target.classList.contains("folder")) {
      //     console.log("willInserAfter", evt.willInsertAfter);
      //     console.log("IS INSIDEEEEEEEEE");
      //     // Example custom logic: require dragged element to overlap 70% of folder to allow drop

      //     const mouseX = evt.originalEvent.clientX;
      //     const mouseY = evt.originalEvent.clientY;

      //     const rect = target.getBoundingClientRect();

      //     drawVerticalDebugLines(rect.left, rect.right);

      //     const thresshold = 20; /// in pixels

      //     target.classList.add("folder-hover");

      //     return false;
      //   } else {
      //     document
      //       .querySelectorAll(".folder-hover")
      //       .forEach((el) => el.classList.remove("folder-hover"));

      //     return true;
      //   }
      // }}
      onEnd={() => {
        // Clean up the visual effect after drop
        document.querySelectorAll(".folder.folder-hover").forEach((el) => {
          el.classList.remove("folder-hover");
        });
      }}
      ghostClass="sortable-grid-ghost-class"
    >
      {bookmarks.map((bookmark) => (
        <BookmarkComponent
          key={bookmark.id}
          bookmark={bookmark}
          onClick={onClickBookmark}
          onAuxClick={onAuxClickBookmark}
        />
      ))}
    </ReactSortable>
  );
}

export function drawVerticalDebugLines(
  x1: number,
  x2: number,
  color1: string = "red",
  color2: string = "blue"
): void {
  const makeLine = (id: string, x: number, color: string): void => {
    let line = document.getElementById(id) as HTMLDivElement | null;
    if (!line) {
      line = document.createElement("div");
      line.id = id;

      Object.assign(line.style, {
        position: "fixed",
        top: "0",
        bottom: "0",
        width: "1px",
        pointerEvents: "none",
        zIndex: "9999",
      });

      document.body.appendChild(line);
    }

    Object.assign(line.style, {
      left: `${x}px`,
      background: color,
    });
  };

  makeLine("debug-line-1", x1, color1);
  makeLine("debug-line-2", x2, color2);
}
