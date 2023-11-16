// journal-form.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JournalService } from '../services/journal.service';
import { Journal } from '../interfaces/journal';
import { generateUniqueId } from '../utilities/generate-id';

@Component({
  selector: 'app-journal-form',
  templateUrl: './journal-form.component.html',
  styleUrls: ['./journal-form.component.scss'],
})
export class JournalFormComponent implements OnInit {
  journal: Journal = {
    id: '', // You might generate a unique ID for new entries
    title: '',
    content: '',
    date: new Date(),
    collectionId: '', // Initialize with the collection ID (you need to fetch this from the route or service)
  };

  isEditing = false;

  constructor(private route: ActivatedRoute, private router: Router, private journalService: JournalService) {}

  ngOnInit(): void {
    this.checkEditMode();
  }

  deleteJournal() {
    const collectionId = this.route.snapshot.paramMap.get('collectionId');
    const journalId = this.route.snapshot.paramMap.get('journalId');
    if (collectionId && journalId) {
      // Delete the journal entry
      this.journalService.deleteJournal(journalId);
      // Navigate back to the journal list
      this.router.navigate(['/collections', collectionId, 'journals']);
    }
  }

  checkEditMode() {
    const journalId = this.route.snapshot.paramMap.get('journalId');
    
    let existingJournal = null;
    if(journalId){
      existingJournal = this.journalService.getJournalById(journalId);
    }
    if (existingJournal) {
      // Editing an existing journal entry
      this.isEditing = true;
      this.journal = existingJournal;
    }
    else {
     // Handle case where the journal entry is not found
   }
  }
  
  onSubmit() {
    if (this.isEditing) {
      // Update existing journal entry
      this.journalService.updateJournal(this.journal);
    } else {
      // Create new journal entry
      const collectionId = this.route.snapshot.paramMap.get('collectionId');
      const newId  = generateUniqueId();
      this.journalService.addJournal({ ...this.journal, id: newId, collectionId:collectionId ?? ""});
      const newJournal = this.journalService.getJournalById(newId);
      if (newJournal){
        this.journal = newJournal;
      }
    }
    
    
    // Navigate back to the journal list (replace 'journals' with your actual route)
    this.router.navigate(['/collections', this.journal.collectionId, 'journals']);
  }
}

