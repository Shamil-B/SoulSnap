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
import { getMoodInfo } from '../shared/mood-data';

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

  availableMoods: { key: string; emoji: string; label: string }[] = [];
  selectedMoodFilters = new Set<string>();

  pageSize = 6;
  pageIndex = 0;
  totalItems = 0;

  private destroy$ = new Subject<void>();

  constructor(
    private journalService: JournalService,
    private route: ActivatedRoute,
    private router: Router,
    private collectionService: CollectionService
  ) { }

  ngOnInit(): void {
    this.title = this.route.snapshot.paramMap.get('title') ?? '';
    this.loadJournals();

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
          this.buildAvailableMoods();
          this.applyFilterAndSort();
          this.isLoading = false;
        }
      }).catch(error => { console.log(error); this.isLoading = false; });
    }
  }

  buildAvailableMoods() {
    const moodKeys = new Set<string>();
    for (const j of this.journals) {
      if (j.mood) moodKeys.add(j.mood);
      if (j.additionalMoods) j.additionalMoods.forEach(m => moodKeys.add(m));
    }
    this.availableMoods = Array.from(moodKeys)
      .map(key => {
        const info = getMoodInfo(key);
        return info ? { key, emoji: info.emoji, label: info.label } : null;
      })
      .filter((m): m is { key: string; emoji: string; label: string } => m !== null);
  }

  toggleMoodFilter(key: string) {
    if (this.selectedMoodFilters.has(key)) {
      this.selectedMoodFilters.delete(key);
    } else {
      this.selectedMoodFilters.add(key);
    }
    this.applyFilterAndSort();
  }

  clearMoodFilters() {
    this.selectedMoodFilters.clear();
    this.applyFilterAndSort();
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
    if (this.selectedMoodFilters.size > 0) {
      result = result.filter(j => {
        const journalMoods = new Set<string>();
        if (j.mood) journalMoods.add(j.mood);
        if (j.additionalMoods) j.additionalMoods.forEach(m => journalMoods.add(m));
        return Array.from(this.selectedMoodFilters).some(f => journalMoods.has(f));
      });
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

  getMood(mood?: string) { return getMoodInfo(mood); }

  editJournal(journalId: string) {
    const collectionId = this.route.snapshot.paramMap.get('collectionId');
    if (collectionId && journalId) { this.router.navigate(['create-journal', collectionId, journalId, this.title]); }
  }

  navigateToCreateJournal() { this.router.navigate(['create-journal', this.collection?.id, '0', this.title]); }
}
