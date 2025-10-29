export type BookmarkType = "folder" | "bookmark";

export interface Bookmark {
  id: string;
  name: string;
  type: BookmarkType;
  url?: string;
  parentId?: string;
  children?: Bookmark[];
}