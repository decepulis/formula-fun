import type { SvelteComponent } from "svelte";

export type Row = Object;

// Still haven't figured out svelte and generics
// interface BaseColumn<R> {
interface BaseColumn {
  label: string;
  colspan?: number;
  sortDisabled?: boolean;
  defaultSort?: boolean;
  sortFirst?: "ascending" | "descending";
  accessor?: string; // keyof R
}
export interface FormatColumn extends BaseColumn {
  accessor: string;
  formatter?: (accessedValue: any) => any;
}
interface BaseComponentColumn extends BaseColumn {
  componentFn: (
    row: Row,
    accessedValue: any
  ) => {
    this: typeof SvelteComponent;
    props?: object;
  };
}

interface SortableComponentColumn extends BaseComponentColumn {
  sortDisabled: false;
  accessor: string;
  sortValue?: (accessedValue: any) => any;
}
interface UnsortableComponentColumn extends BaseComponentColumn {
  sortDisabled: true;
}
export type ComponentColumn =
  | SortableComponentColumn
  | UnsortableComponentColumn;

export type Column = FormatColumn | ComponentColumn | null;
export type NoNullColumn = FormatColumn | ComponentColumn;
