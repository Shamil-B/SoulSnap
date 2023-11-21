// journal.service.ts

import { Injectable } from '@angular/core';
import { Journal } from '../interfaces/journal';
import { CollectionService } from './collection.service';
import { Collection } from '../interfaces/collections';

@Injectable({
  providedIn: 'root',
})
export class JournalService {

  constructor(private collectionService : CollectionService) {}
  // Get all journals
  getJournals(collection : Collection): Journal[] {
   return collection.journals;
  }


  // Get journals within a specific collection
  getJournalById(collection: Collection, journalId : string): Journal{
    return collection.journals.filter((journal) => journal.id === journalId)[0];
  }

  // Add a new journal entry
  addJournal(collection: Collection, journal : Journal): void {
    journal.date = new Date();
    collection.journals.push(journal);
    this.collectionService.updateCollection(collection);
    }

  // Update an existing journal entry
  updateJournal(collection : Collection, updatedJournal: Journal): void {
    collection.journals = collection.journals.map((journal) => {
      if (journal.id === updatedJournal.id) {
        return updatedJournal;
      }
      return journal;
    });
    this.collectionService.updateCollection(collection);
  }

  // Delete a journal entry by ID
  deleteJournal(collection : Collection, journalId : string): void {
    collection.journals = collection.journals.filter((journal) => journal.id !== journalId);
    this.collectionService.updateCollection(collection);
  }
}
