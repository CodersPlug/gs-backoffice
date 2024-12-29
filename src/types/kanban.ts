import { UniqueIdentifier } from "@dnd-kit/core";

export interface Pin {
  id: string;
  image: string;
  title: string;
  description: string;
  author: string;
}

export interface Column {
  id: string;
  title: string;
  items: Pin[];
}

export interface DragEndData {
  active: { id: UniqueIdentifier };
  over: { id: UniqueIdentifier } | null;
}