
export interface Journal {
    id: string; // Unique identifier
    title: string;
    content: string;
    date: Date;
    collectionId: string; // Reference to the collection to which the entry belongs
  }
  