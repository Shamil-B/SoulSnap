// journal-form.component.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  journalForm: FormGroup;
  title = '';
  isLoading = false;
  isEditing = false;
  private journalId = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private journalService: JournalService,
    private authService: AuthService,
    private collectionService: CollectionService
  ) {
    this.journalForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      content: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.title = this.route.snapshot.paramMap.get('title') ?? '';
    if (this.authService.isLoggedIn()) {
      this.checkEditMode();
    } else {
      this.router.navigate(['/login']);
    }
  }

  checkEditMode() {
    const journalId = this.route.snapshot.paramMap.get('journalId');
    const collectionId = this.route.snapshot.paramMap.get('collectionId');

    if (journalId && journalId !== '0') {
      this.isLoading = true;
      this.journalId = journalId;
      this.collectionService.getCollectionById(collectionId ?? '').forEach((collection) => {
        if (collection) {
          const existingJournal = this.journalService.getJournalById(collection, journalId);
          if (existingJournal) {
            this.isEditing = true;
            this.journalForm.patchValue({
              title: existingJournal.title,
              content: existingJournal.content
            });
          }
          this.isLoading = false;
        }
      }).catch(error => {
        console.log(error);
        this.isLoading = false;
      });
    }
  }

  deleteJournal() {
    const collectionId = this.route.snapshot.paramMap.get('collectionId');
    const journalId = this.route.snapshot.paramMap.get('journalId');
    if (collectionId && journalId) {
      this.collectionService.getCollectionById(collectionId).forEach((collection) => {
        if (collection) {
          this.journalService.deleteJournal(collection, journalId);
          this.router.navigate(['/collections', collectionId, 'journals', this.title]);
        }
      });
    }
  }

  onSubmit() {
    if (this.journalForm.invalid) {
      this.journalForm.markAllAsTouched();
      return;
    }

    const collectionId: string = this.route.snapshot.paramMap.get('collectionId') ?? '';
    const formValue = this.journalForm.value;

    if (this.isEditing) {
      this.collectionService.getCollectionById(collectionId).forEach((collection) => {
        if (collection) {
          const journal: Journal = {
            id: this.journalId,
            title: formValue.title,
            content: formValue.content,
            date: new Date(),
            collectionId: collectionId
          };
          this.journalService.updateJournal(collection, journal);
          this.router.navigate(['/collections', collectionId, 'journals', this.title]);
        }
      });
    } else {
      const newId = generateUniqueId();
      this.collectionService.getCollectionById(collectionId).forEach((collection) => {
        if (collection) {
          const journal: Journal = {
            id: newId,
            title: formValue.title,
            content: formValue.content,
            date: new Date(),
            collectionId: collection.id
          };
          this.journalService.addJournal(collection, journal);
          this.router.navigate(['/collections', collectionId, 'journals', this.title]);
        }
      });
    }
  }

  navigateBack() {
    const collectionId = this.route.snapshot.paramMap.get('collectionId');
    this.router.navigate(['/collections', collectionId, 'journals', this.title]);
  }
}
