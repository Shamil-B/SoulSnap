// journal-list.component.ts

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { JournalService } from '../services/journal.service'; // Import your journal service
import { Journal } from '../interfaces/journal'; // Import the JournalEntry ince
import { CollectionService } from '../services/collection.service';
import { Collection } from '../interfaces/collections';

@Component({
  selector: 'app-journal-list',
  templateUrl: './journal-list.component.html',
  styleUrls: ['./journal-list.component.scss'],
})
export class JournalListComponent implements OnInit {
  journals: Journal[] = [];
  collection? : Collection;
  constructor(private journalService: JournalService, private route: ActivatedRoute, private router: Router, private collectionService: CollectionService) {}
  
  ngOnInit(): void {
    this.loadJournals();
  }
  
  loadJournals() {
    let collectionId  = this.route.snapshot.paramMap.get('collectionId');
    if (collectionId) {
      // Fetch journals based on the selected collection
      this.collection = this.collectionService.getCollectionById(collectionId);
      this.journals = this.journalService.getJournalsByCollection(collectionId);
      console.log(this.journals);
    }
  }

  navigateToJournal(journalId: string) {
    // Navigate to the details of the selected journal entry
    const collectionId = this.route.snapshot.paramMap.get('collectionId');
    this.router.navigate(['/collections', collectionId, 'journals', journalId]);
  }

  navigateToCreateJournal(){
    // Navigate to the create journal page
    this.router.navigate(['create-journal', this.collection?.id,"0"]);
  }
}
