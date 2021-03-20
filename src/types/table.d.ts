export type Row = Object;

export interface Column {
  label: string;
  accessor: string;
  formatter?: (any) => any;
  rowScope?: boolean;
  colspan?: number;
  defaultSort?: boolean;
}
