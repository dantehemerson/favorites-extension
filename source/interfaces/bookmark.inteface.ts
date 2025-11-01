export type BookmarkType = "folder" | "bookmark";

export interface Bookmark {
  id: string;
  name: string;
  type: BookmarkType;
  selected?: boolean; // Handled by MultiDrag Sortable.js plugin
  url?: string;
  parentId?: string;
  children?: Bookmark[];
  icon?: string;
}
