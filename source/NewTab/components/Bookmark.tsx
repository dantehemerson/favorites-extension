import React from "react";
import { Bookmark as BookmarkType } from "../../interfaces/bookmark.inteface";
import clsx from "clsx";

export function BookmarkComponent({ bookmark }: { bookmark: BookmarkType }) {
  return (
    <div
      className={clsx(
        "w-[100px] h-[130px] inline-block m-4 align-top",
        "favorite",
        bookmark.type === "folder" && "folder"
      )}
    >
      <div
        className={clsx(
          "bookmark-container",
          "w-full h-full flex flex-col items-center justify-center cursor-pointer p-2",
          "border border-transparent"
        )}
      >
        <img
          src={`https://www.google.com/s2/favicons?domain=${bookmark.url}&sz=64`}
          className="w-[var(--bookmark-icon-size)] h-[var(--bookmark-icon-size)]"
          alt={bookmark.name}
        />

        {bookmark.name && (
          <div className="w-full text-center mt-2">
            <span
              className={clsx(
                "bookmark-name",
                "leading-none p-[2px] rounded-sm",
                "[display:-webkit-box] [-webkit-line-clamp:2] [-webkit-box-orient:vertical] overflow-hidden text-ellipsis",
                "box-decoration-clone"
              )}
            >
              {bookmark.name}
            </span>
          </div>
        )}
      </div>
    </div>
  );
}
