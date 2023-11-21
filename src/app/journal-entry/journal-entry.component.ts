// journal-details.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { JournalService } from '../services/journal.service';
import { Journal } from '../interfaces/journal';

@Component({
  selector: 'app-journal-entry',
  templateUrl: './journal-entry.component.html',
  styleUrls: ['./journal-entry.component.scss'],
})
export class JournalEntryComponent implements OnInit {
  journal: Journal | undefined;

  constructor(private route: ActivatedRoute, private router: Router, private journalService: JournalService) {}

  ngOnInit(): void {
    this.loadJournalDetails();
  }

  loadJournalDetails() {
    const collectionId = this.route.snapshot.paramMap.get('collectionId');
    const journalId = this.route.snapshot.paramMap.get('journalId');
    if (collectionId && journalId) {
      // Fetch the specific journal entry
      // this.journal = this.journalService.getJournalById(journalId);
    }
  }

  editJournal() {
    const collectionId = this.route.snapshot.paramMap.get('collectionId');
    const journalId = this.journal?.id;
    if (collectionId && journalId) {
      // Navigate to the edit page (replace 'edit-journal' with your actual route)
      this.router.navigate(['create-journal', collectionId, journalId]);
    }
  }

  deleteJournal() {
    const collectionId = this.route.snapshot.paramMap.get('collectionId');
    const journalId = this.route.snapshot.paramMap.get('journalId');
    if (collectionId && journalId) {
      // Delete the journal entry
      // this.journalService.deleteJournal(journalId);
      // Navigate back to the journal list
      this.router.navigate(['/collections', collectionId, 'journals']);
    }
  }
}
