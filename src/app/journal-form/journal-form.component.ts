// journal-form.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JournalService } from '../services/journal.service';
import { Journal } from '../interfaces/journal';
import { generateUniqueId } from '../utilities/generate-id';
import { AuthService } from '../services/auth.service';
import { CollectionService } from '../services/collection.service';

@Component({
  selector: 'app-journal-form',
  templateUrl: './journal-form.component.html',
  styleUrls: ['./journal-form.component.scss'],
})
export class JournalFormComponent implements OnInit {
  title:string = '';
    journal: Journal = {
    id: '', // You might generate a unique ID for new entries
    title: '',
    content: '',
    date: new Date(),
    collectionId: '', // Initialize with the collection ID (you need to fetch this from the route or service)
  };
  
  isEditing = false;
  
  constructor(private route: ActivatedRoute, private router: Router, private journalService: JournalService, private authService : AuthService, private collectionService : CollectionService) {}
  
  ngOnInit(): void {
    this.title = this.route.snapshot.paramMap.get('title') ?? '';
    if(this.authService.isLoggedIn()){
      this.checkEditMode();
    }
    else{
      this.router.navigate(['/login']);
    }
  }
  
  deleteJournal() {
    const collectionId = this.route.snapshot.paramMap.get('collectionId');
    const journalId = this.route.snapshot.paramMap.get('journalId');
    if (collectionId && journalId) {
      // Delete the journal entry
      this.collectionService.getCollectionById(collectionId).forEach((collection) => {
        if (collection) {
          this.journalService.deleteJournal(collection, journalId);
        }
      }
      );
      // Navigate back to the journal list
      this.router.navigate(['/collections', collectionId, 'journals', this.title]);
    }
  }

  checkEditMode() {
    const journalId = this.route.snapshot.paramMap.get('journalId');
    const collectionId = this.route.snapshot.paramMap.get('collectionId');
    
    let existingJournal = null;
    if(journalId){
      this.collectionService.getCollectionById(collectionId ?? '').forEach((collection) => {
        if (collection) {
          existingJournal = this.journalService.getJournalById(collection, journalId);
          if (existingJournal) {
            // Editing an existing journal entry
            this.isEditing = true;
            this.journal = existingJournal;
          }
          else {
           // Handle case where the journal entry is not found
         }
        }
      }
      );
    }
  }
  
  onSubmit() {
    const collectionId : string = this.route.snapshot.paramMap.get('collectionId') ?? '';
    if (this.isEditing) {
      // Update existing journal entry
      this.collectionService.getCollectionById(this.journal.collectionId).forEach((collection) => {
        if (collection) {
          this.journalService.updateJournal(collection, this.journal);
        }
      }
      );
    } else {
      // Create new journal entry
      const newId  = generateUniqueId();
      if(collectionId){
        this.collectionService.getCollectionById(collectionId).forEach((collection) => {
          if (collection) {
            this.journal.id = newId;
            this.journal.collectionId = collection.id;
            this.journalService.addJournal(collection, this.journal);
          }
        }
        );
      }
    }

    // Navigate back to the journal list (replace 'journals' with your actual route)
    this.router.navigate(['/collections', collectionId, 'journals', this.title]);
  }

  logout(){
    this.authService.logout();
  }
}

