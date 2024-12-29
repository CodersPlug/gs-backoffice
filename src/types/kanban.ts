import { UniqueIdentifier } from "@dnd-kit/core";

export interface Pin {
  id: string;  // This is the Supabase UUID
  image?: string;
  title: string;
  description: string | null;
  author: string | null;
  order_index: number;
  column_id: string | null;
}

export interface DraggablePin extends Omit<Pin, 'id'> {
  id: UniqueIdentifier;  // This is for DnD Kit
  originalId: string;    // This is the Supabase UUID
}

export interface Column {
  id: string;
  title: string;
  items: Pin[];
  order_index: number;
}