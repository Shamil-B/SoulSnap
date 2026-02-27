import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { MatDialog } from '@angular/material/dialog';
import { JournalService } from '../services/journal.service';
import { Journal } from '../interfaces/journal';
import { generateUniqueId } from '../utilities/generate-id';
import { AuthService } from '../services/auth.service';
import { CollectionService } from '../services/collection.service';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component';

const MOODS = [
  { value: 'energized', emoji: '🔥', label: 'Energized' },
  { value: 'calm', emoji: '😌', label: 'Calm' },
  { value: 'inspired', emoji: '💡', label: 'Inspired' },
  { value: 'frustrated', emoji: '😤', label: 'Frustrated' },
  { value: 'reflective', emoji: '🌙', label: 'Reflective' },
];

@Component({ selector: 'app-journal-form', templateUrl: './journal-form.component.html', styleUrls: ['./journal-form.component.scss'] })
export class JournalFormComponent implements OnInit {
  journalForm: FormGroup;
  title = '';
  isLoading = false;
  isEditing = false;
  moods = MOODS;
  private journalId = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private journalService: JournalService,
    private authService: AuthService,
    private collectionService: CollectionService,
    private dialog: MatDialog
  ) {
    this.journalForm = this.fb.group({
      title: ['', [Validators.required, Validators.maxLength(100)]],
      content: ['', [Validators.required]],
      mood: ['']
    });
  }

  ngOnInit(): void {
    this.title = this.route.snapshot.paramMap.get('title') ?? '';
    if (this.authService.isLoggedIn()) { this.checkEditMode(); } else { this.router.navigate(['/login']); }
  }

  checkEditMode() {
    const journalId = this.route.snapshot.paramMap.get('journalId');
    const collectionId = this.route.snapshot.paramMap.get('collectionId');
    if (journalId && journalId !== '0') {
      this.isLoading = true; this.journalId = journalId;
      this.collectionService.getCollectionById(collectionId ?? '').forEach((collection) => {
        if (collection) {
          const existingJournal = this.journalService.getJournalById(collection, journalId);
          if (existingJournal) {
            this.isEditing = true;
            this.journalForm.patchValue({ title: existingJournal.title, content: existingJournal.content, mood: existingJournal.mood || '' });
          }
          this.isLoading = false;
        }
      }).catch(error => { console.log(error); this.isLoading = false; });
    }
  }

  deleteJournal() {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      panelClass: 'cosmic-dialog',
      data: {
        title: 'Delete Journal?',
        message: 'This thought fragment will be permanently erased from the multiverse. No portal gun can bring it back.',
        confirmText: 'Erase',
      }
    });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        const collectionId = this.route.snapshot.paramMap.get('collectionId');
        const journalId = this.route.snapshot.paramMap.get('journalId');
        if (collectionId && journalId) {
          this.collectionService.getCollectionById(collectionId).forEach((collection) => {
            if (collection) { this.journalService.deleteJournal(collection, journalId); this.router.navigate(['/collections', collectionId, 'journals', this.title]); }
          });
        }
      }
    });
  }

  onSubmit() {
    if (this.journalForm.invalid) { this.journalForm.markAllAsTouched(); return; }
    const collectionId: string = this.route.snapshot.paramMap.get('collectionId') ?? '';
    const formValue = this.journalForm.value;
    if (this.isEditing) {
      this.collectionService.getCollectionById(collectionId).forEach((collection) => {
        if (collection) {
          const journal: Journal = { id: this.journalId, title: formValue.title, content: formValue.content, date: new Date(), collectionId, mood: formValue.mood || undefined };
          this.journalService.updateJournal(collection, journal);
          this.router.navigate(['/collections', collectionId, 'journals', this.title]);
        }
      });
    } else {
      const newId = generateUniqueId();
      this.collectionService.getCollectionById(collectionId).forEach((collection) => {
        if (collection) {
          const journal: Journal = { id: newId, title: formValue.title, content: formValue.content, date: new Date(), collectionId: collection.id, mood: formValue.mood || undefined };
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
