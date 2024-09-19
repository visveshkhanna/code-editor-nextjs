export interface DirectoryItemType {
  name: string;
  type: "file" | "folder";
  children?: DirectoryItemType[];
}
