import type { SvelteComponent } from "svelte";

export type Row = Object;

export interface InputProps {
  type: string;
  onChange: svelte.JSX.FormEventHandler<HTMLInputElement>;
}

export interface Column {
  label: string;
  accessor: string;
  colspan?: number;
  defaultSort?: boolean;

  input?: boolean;
  formatter?: (any) => any;
}
