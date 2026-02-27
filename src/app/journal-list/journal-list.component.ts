import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { FormControl } from '@angular/forms';
import { PageEvent } from '@angular/material/paginator';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { trigger, transition, style, animate } from '@angular/animations';
import { JournalService } from '../services/journal.service';
import { Journal } from '../interfaces/journal';
import { CollectionService } from '../services/collection.service';
import { Collection } from '../interfaces/collections';
import { AuthService } from '../services/auth.service';

const MOOD_MAP: Record<string, { emoji: string; label: string }> = {
  energized: { emoji: '🔥', label: 'Energized' },
  calm: { emoji: '😌', label: 'Calm' },
  inspired: { emoji: '💡', label: 'Inspired' },
  frustrated: { emoji: '😤', label: 'Frustrated' },
  reflective: { emoji: '🌙', label: 'Reflective' },
  happy: { emoji: '😊', label: 'Happy' },
  sad: { emoji: '😢', label: 'Sad' },
  angry: { emoji: '😠', label: 'Angry' },
  anxious: { emoji: '😰', label: 'Anxious' },
  excited: { emoji: '🤩', label: 'Excited' },
  tired: { emoji: '😴', label: 'Tired' },
  sick: { emoji: '🤒', label: 'Sick' },
  creative: { emoji: '🎨', label: 'Creative' },
  nostalgic: { emoji: '📼', label: 'Nostalgic' },
  grateful: { emoji: '🙏', label: 'Grateful' },
  loved: { emoji: '🥰', label: 'Loved' },
  confident: { emoji: '😎', label: 'Confident' },
  curious: { emoji: '🧐', label: 'Curious' },
  overwhelmed: { emoji: '🤯', label: 'Overwhelmed' },
  relaxed: { emoji: '🛋️', label: 'Relaxed' },
  focused: { emoji: '🎯', label: 'Focused' },
  confused: { emoji: '😵‍💫', label: 'Confused' },
  adventurous: { emoji: '🌍', label: 'Adventurous' },
  romantic: { emoji: '🌹', label: 'Romantic' },
  silly: { emoji: '🤪', label: 'Silly' },
  lonely: { emoji: '🥀', label: 'Lonely' },
  proud: { emoji: '🏆', label: 'Proud' },
  bored: { emoji: '🥱', label: 'Bored' },
  hopeful: { emoji: '🌈', label: 'Hopeful' },
  jealous: { emoji: '😒', label: 'Jealous' }
};

@Component({
  selector: 'app-journal-list',
  templateUrl: './journal-list.component.html',
  styleUrls: ['./journal-list.component.scss'],
  animations: [
    trigger('cardAnim', [
      transition(':enter', [
        style({ opacity: 0, transform: 'translateY(16px) scale(0.97)' }),
        animate('350ms ease-out', style({ opacity: 1, transform: 'translateY(0) scale(1)' }))
      ]),
      transition(':leave', [
        animate('250ms ease-in', style({ opacity: 0, transform: 'scale(0.95)' }))
      ])
    ])
  ]
})
export class JournalListComponent implements OnInit, OnDestroy {
  journals: Journal[] = [];
  filteredJournals: Journal[] = [];
  pagedJournals: Journal[] = [];
  collection?: Collection;
  isLoading = false;
  title = '';

  searchControl = new FormControl('');
  sortMode: 'newest' | 'oldest' | 'name' = 'newest';

  pageSize = 6;
  pageIndex = 0;
  totalItems = 0;

  private destroy$ = new Subject<void>();

  constructor(
    private journalService: JournalService,
    private route: ActivatedRoute,
    private router: Router,
    private collectionService: CollectionService,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    this.title = this.route.snapshot.paramMap.get('title') ?? '';
    if (this.authService.isLoggedIn()) { this.loadJournals(); } else { this.router.navigate(['/login']); }

    this.searchControl.valueChanges.pipe(
      debounceTime(300), distinctUntilChanged(), takeUntil(this.destroy$)
    ).subscribe(() => this.applyFilterAndSort());
  }

  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }

  loadJournals() {
    this.isLoading = true;
    const collectionId = this.route.snapshot.paramMap.get('collectionId');
    if (collectionId) {
      this.collectionService.getCollectionById(collectionId).pipe(takeUntil(this.destroy$)).forEach((collection) => {
        if (collection) {
          this.collection = collection;
          this.journals = this.journalService.getJournals(this.collection);
          this.applyFilterAndSort();
          this.isLoading = false;
        }
      }).catch(error => { console.log(error); this.isLoading = false; });
    }
  }

  applyFilterAndSort() {
    let result = [...this.journals];
    const query = (this.searchControl.value || '').toLowerCase().trim();
    if (query) {
      result = result.filter(j =>
        j.title.toLowerCase().includes(query) ||
        (j.content && j.content.toLowerCase().includes(query))
      );
    }
    switch (this.sortMode) {
      case 'name': result.sort((a, b) => a.title.localeCompare(b.title)); break;
      case 'newest': result.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime()); break;
      case 'oldest': result.sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()); break;
    }
    this.filteredJournals = result;
    this.totalItems = result.length;
    this.pageIndex = 0;
    this.updatePage();
  }

  onSortChange(mode: string) { this.sortMode = mode as any; this.applyFilterAndSort(); }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.updatePage();
  }

  private updatePage() {
    const start = this.pageIndex * this.pageSize;
    this.pagedJournals = this.filteredJournals.slice(start, start + this.pageSize);
  }

  getMood(mood?: string) { return mood ? MOOD_MAP[mood] : null; }

  editJournal(journalId: string) {
    const collectionId = this.route.snapshot.paramMap.get('collectionId');
    if (collectionId && journalId) { this.router.navigate(['create-journal', collectionId, journalId, this.title]); }
  }

  navigateToCreateJournal() { this.router.navigate(['create-journal', this.collection?.id, '0', this.title]); }
}
