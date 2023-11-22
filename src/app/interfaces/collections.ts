import { Journal } from "./journal";

export interface Collection {
    id: string; // You can use a unique identifier, e.g., generated with UUID or timestamp
    name: string;
    description: string;
    journals: Journal[];
    creationDate: Date;
    creator_email: string;
  }
  