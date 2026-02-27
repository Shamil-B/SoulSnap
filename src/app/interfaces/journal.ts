
export interface Journal {
  id: string;
  title: string;
  content: string;
  date: Date;
  collectionId: string;
  mood?: string; // Optional mood tag
  additionalMoods?: string[];
}