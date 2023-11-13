// journal.service.ts

import { Injectable } from '@angular/core';
import { Journal } from '../interfaces/journal';

@Injectable({
  providedIn: 'root',
})
export class JournalService {
  private journals: Journal[] = [
    // Sample data, replace with your actual data
    {
      id: '1',
      title: 'Exploring a New City',
      content: 'Visited amazing places and tried local cuisine.',
      date: new Date('2023-03-15'),
      collectionId: '1', // Reference to the collection
    },
    {
      id: '2',
      title: 'Reflecting on Life',
      content: 'Contemplated goals and aspirations.',
      date: new Date('2023-03-20'),
      collectionId: '2', // Reference to the collection
    },
    // Add more journals as needed
  ];

  // Get all journals
  getJournals(): Journal[] {
    return this.journals;
  }

  // Get journals within a specific collection
  getJournalsByCollection(collectionId: string): Journal[] {
    return this.journals.filter((journal) => journal.collectionId === collectionId);
  }

  // Get a specific journal by ID
  getJournalById(id: string): Journal | undefined {
    return this.journals.find((journal) => journal.id === id);
  }

  // Add a new journal entry
  addJournal(newJournal: Journal): void {
    console.log(newJournal);
    this.journals.push(newJournal);
  }

  // Update an existing journal entry
  updateJournal(updatedJournal: Journal): void {
    const index = this.journals.findIndex((journal) => journal.id === updatedJournal.id);
    if (index !== -1) {
      this.journals[index] = updatedJournal;
    }
  }

  // Delete a journal entry by ID
  deleteJournal(id: string): void {
    this.journals = this.journals.filter((journal) => journal.id !== id);
  }
}
