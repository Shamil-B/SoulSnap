// journal-list.component.ts

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { JournalService } from '../services/journal.service';
import { Journal } from '../interfaces/journal';
import { CollectionService } from '../services/collection.service';
import { Collection } from '../interfaces/collections';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-journal-list',
  templateUrl: './journal-list.component.html',
  styleUrls: ['./journal-list.component.scss'],
})
export class JournalListComponent implements OnInit {
  journals: Journal[] = [];
  collection?: Collection;
  isLoading = false;
  title = '';

  constructor(
    private journalService: JournalService,
    private route: ActivatedRoute,
    private router: Router,
    private collectionService: CollectionService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.title = this.route.snapshot.paramMap.get('title') ?? '';
    if (this.authService.isLoggedIn()) {
      this.loadJournals();
    } else {
      this.router.navigate(['/login']);
    }
  }

  loadJournals() {
    this.isLoading = true;
    const collectionId = this.route.snapshot.paramMap.get('collectionId');
    if (collectionId) {
      this.collectionService.getCollectionById(collectionId).forEach((collection) => {
        if (collection) {
          this.collection = collection;
          this.journals = this.journalService.getJournals(this.collection);
          this.isLoading = false;
        }
      }).catch(error => {
        console.log(error);
        this.isLoading = false;
      });
    }
  }

  editJournal(journalId: string) {
    const collectionId = this.route.snapshot.paramMap.get('collectionId');
    if (collectionId && journalId) {
      this.router.navigate(['create-journal', collectionId, journalId, this.title]);
    }
  }

  navigateToCreateJournal() {
    this.router.navigate(['create-journal', this.collection?.id, '0', this.title]);
  }
}
