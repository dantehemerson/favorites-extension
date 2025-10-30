import React from "react";
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator,
} from "@/components/ui/breadcrumb";
import { Bookmark } from "source/interfaces/bookmark.inteface";

export function FolderBreadcrumbs({ path }: { path: Bookmark[] }) {
  return (
    <div className="full-width flex justify-center py-4 bg-[#00000008]">
      <Breadcrumb>
        <BreadcrumbList>
          {path
            // Filter out the root node
            .filter((bookmark) => bookmark.parentId)
            .map((bookmark, index, items) => {
              const isFirst = index === 0;
              const isLast = index === items.length - 1;

              if (!isLast) {
                return (
                  <>
                    {!isFirst && <BreadcrumbSeparator />}
                    <BreadcrumbItem key={bookmark.id}>
                      <BreadcrumbLink
                        onClick={() => {
                          location.hash = `#folderId=${bookmark.id}`;
                        }}
                      >
                        {bookmark.name}
                      </BreadcrumbLink>
                    </BreadcrumbItem>
                  </>
                );
              } else {
                return (
                  <>
                    {!isFirst && <BreadcrumbSeparator />}
                    <BreadcrumbItem key={bookmark.id}>
                      <BreadcrumbPage className="font-bold">
                        {bookmark.name}
                      </BreadcrumbPage>
                    </BreadcrumbItem>
                  </>
                );
              }
            })}
        </BreadcrumbList>
      </Breadcrumb>
    </div>
  );
}
