import { UniqueIdentifier } from "@dnd-kit/core";

export interface Pin {
  id: UniqueIdentifier;
  image?: string;
  title: string;
  description: string | null;
  author: string | null;
  order_index: number;
  column_id: string | null;
}

export interface Column {
  id: string;
  title: string;
  items: Pin[];
  order_index: number;
}

export interface DragEndData {
  active: { id: UniqueIdentifier };
  over: { id: UniqueIdentifier } | null;
}