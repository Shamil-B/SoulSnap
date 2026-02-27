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
  { value: 'happy', emoji: '😊', label: 'Happy' },
  { value: 'sad', emoji: '😢', label: 'Sad' },
  { value: 'angry', emoji: '😠', label: 'Angry' },
  { value: 'anxious', emoji: '😰', label: 'Anxious' },
  { value: 'excited', emoji: '🤩', label: 'Excited' },
  { value: 'tired', emoji: '😴', label: 'Tired' },
  { value: 'sick', emoji: '🤒', label: 'Sick' },
  { value: 'creative', emoji: '🎨', label: 'Creative' },
  { value: 'nostalgic', emoji: '📼', label: 'Nostalgic' },
  { value: 'grateful', emoji: '🙏', label: 'Grateful' },
  { value: 'loved', emoji: '🥰', label: 'Loved' },
  { value: 'confident', emoji: '😎', label: 'Confident' },
  { value: 'curious', emoji: '🧐', label: 'Curious' },
  { value: 'overwhelmed', emoji: '🤯', label: 'Overwhelmed' },
  { value: 'relaxed', emoji: '🛋️', label: 'Relaxed' },
  { value: 'focused', emoji: '🎯', label: 'Focused' },
  { value: 'confused', emoji: '😵‍💫', label: 'Confused' },
  { value: 'adventurous', emoji: '🌍', label: 'Adventurous' },
  { value: 'romantic', emoji: '🌹', label: 'Romantic' },
  { value: 'silly', emoji: '🤪', label: 'Silly' },
  { value: 'lonely', emoji: '🥀', label: 'Lonely' },
  { value: 'proud', emoji: '🏆', label: 'Proud' },
  { value: 'bored', emoji: '🥱', label: 'Bored' },
  { value: 'hopeful', emoji: '🌈', label: 'Hopeful' },
  { value: 'jealous', emoji: '😒', label: 'Jealous' }
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
      mood: [''],
      additionalMoods: [[]]
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
            this.journalForm.patchValue({
              title: existingJournal.title,
              content: existingJournal.content,
              mood: existingJournal.mood || '',
              additionalMoods: existingJournal.additionalMoods || []
            });
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
          const journal: Journal = { id: this.journalId, title: formValue.title, content: formValue.content, date: new Date(), collectionId, mood: formValue.mood || undefined, additionalMoods: formValue.additionalMoods || [] };
          this.journalService.updateJournal(collection, journal);
          this.router.navigate(['/collections', collectionId, 'journals', this.title]);
        }
      });
    } else {
      const newId = generateUniqueId();
      this.collectionService.getCollectionById(collectionId).forEach((collection) => {
        if (collection) {
          const journal: Journal = { id: newId, title: formValue.title, content: formValue.content, date: new Date(), collectionId: collection.id, mood: formValue.mood || undefined, additionalMoods: formValue.additionalMoods || [] };
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

  isMoodSelected(moodValue: string): boolean {
    const mainMood = this.journalForm.get('mood')?.value;
    const additional = this.journalForm.get('additionalMoods')?.value || [];
    return mainMood === moodValue || additional.includes(moodValue);
  }

  toggleMood(moodValue: string) {
    const mainMood = this.journalForm.get('mood')?.value;
    const additional: string[] = this.journalForm.get('additionalMoods')?.value || [];

    if (this.isMoodSelected(moodValue)) {
      if (mainMood === moodValue) {
        this.journalForm.get('mood')?.setValue('');
        if (additional.length > 0) {
          this.journalForm.get('mood')?.setValue(additional[0]);
          this.journalForm.get('additionalMoods')?.setValue(additional.slice(1));
        }
      } else {
        this.journalForm.get('additionalMoods')?.setValue(additional.filter((m: string) => m !== moodValue));
      }
    } else {
      if (!mainMood) {
        this.journalForm.get('mood')?.setValue(moodValue);
      } else {
        this.journalForm.get('additionalMoods')?.setValue([...additional, moodValue]);
      }
    }
  }

  setMainMood(moodValue: string, event: Event) {
    event.stopPropagation();
    const mainMood = this.journalForm.get('mood')?.value;
    const additional: string[] = this.journalForm.get('additionalMoods')?.value || [];

    if (mainMood === moodValue) return;

    let newAdditional = [...additional];
    if (mainMood) {
      newAdditional.push(mainMood);
    }
    newAdditional = newAdditional.filter(m => m !== moodValue);

    this.journalForm.get('mood')?.setValue(moodValue);
    this.journalForm.get('additionalMoods')?.setValue(newAdditional);
  }
}
