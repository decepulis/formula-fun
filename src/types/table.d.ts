import type { SvelteComponent } from "svelte";

export type Row = Object;

// Still haven't figured out svelte and generics
// interface BaseColumn<R> {
interface BaseColumn {
  label: string;
  colspan?: number;
  sortDisabled?: boolean;
  defaultSort?: boolean;
  accessor: string; // keyof R
}
export interface FormatColumn extends BaseColumn {
  formatter?: (accessedValue: any) => any;
}
interface BaseComponentColumn extends BaseColumn {
  componentFn: (
    accessedValue: any
  ) => {
    this: typeof SvelteComponent;
    props?: object;
  };
}

interface SortableComponentColumn extends BaseComponentColumn {
  sortDisabled: false;
  sortValue: (accessedValue: any) => any;
}
interface UnsortableComponentColumn extends BaseComponentColumn {
  sortDisabled: true;
}
export type ComponentColumn =
  | SortableComponentColumn
  | UnsortableComponentColumn;

export type Column = FormatColumn | ComponentColumn;
