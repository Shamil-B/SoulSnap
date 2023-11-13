// collection.service.ts

import { Injectable } from '@angular/core';
import { Collection } from '../interfaces/collections';

@Injectable({
  providedIn: 'root',
})
export class CollectionService {
  private collections: Collection[] = [
    // Sample data, replace with your actual data
    {
      id: '1',
      name: 'Travel Journals',
      description: 'Memories from around the world',
      creationDate: new Date(),
    },
    {
      id: '2',
      name: 'Personal Reflections',
      description: 'Thoughts and musings',
      creationDate: new Date(),
    },
    // Add more collections as needed
  ];

  // Get all collections
  getCollections(): Collection[] {
    return this.collections;
  }

  // Get a specific collection by ID
  getCollectionById(id: string): Collection | undefined {
    return this.collections.find((collection) => collection.id === id);
  }

  // Add a new collection
  addCollection(newCollection: Collection): void {
    this.collections.push(newCollection);
  }

  // Update an existing collection
  updateCollection(updatedCollection: Collection): void {
    const index = this.collections.findIndex((collection) => collection.id === updatedCollection.id);
    if (index !== -1) {
      this.collections[index] = updatedCollection;
    }
  }

  // Delete a collection by ID
  deleteCollection(id: string): void {
    this.collections = this.collections.filter((collection) => collection.id !== id);
  }
}
