// journal-list.component.ts

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { JournalService } from '../services/journal.service'; // Import your journal service
import { Journal } from '../interfaces/journal'; // Import the JournalEntry ince
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
  collection? : Collection;
  isLoading : boolean = false;
  title = '';
  constructor(private journalService: JournalService, private route: ActivatedRoute, private router: Router, private collectionService: CollectionService, private authService : AuthService) {}
  
  ngOnInit(): void {
    this.title = this.route.snapshot.paramMap.get('title') ?? '';
    if(this.authService.isLoggedIn()){
      // we will refresh the page
      this.loadJournals();
    }
    else{
      this.router.navigate(['/login']);
    }
  }
  loadJournals() {
    this.isLoading = true;
    let collectionId  = this.route.snapshot.paramMap.get('collectionId');
    if(collectionId){
      this.collectionService.getCollectionById(collectionId).forEach((collection) => {
        if (collection) {
          this.collection = collection;
          this.journals = this.journalService.getJournals(this.collection);
          this.isLoading = false;
        }
      }
      ).catch(error => {
        console.log(error);
        this.isLoading = false;
      });
    }
  }

  navigateToJournal(journalId: string) {
    // Navigate to the details of the selected journal entry
    const collectionId = this.route.snapshot.paramMap.get('collectionId');
    this.router.navigate(['/collections', collectionId, 'journals', journalId]);
  }

  navigateToCreateJournal(){
    // Navigate to the create journal page
    this.router.navigate(['create-journal', this.collection?.id,"0",this.title]);
  }

  editJournal(journalId: string) {
    const collectionId = this.route.snapshot.paramMap.get('collectionId');
    if (collectionId && journalId) {
      // Navigate to the edit page (replace 'edit-journal' with your actual route)
      this.router.navigate(['create-journal', collectionId, journalId, this.title]);
    }
  }

  logout(){
    this.authService.logout();
  }
}
