import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { CollectionService } from '../services/collection.service';
import { Collection } from '../interfaces/collections';
import { Journal } from '../interfaces/journal';
import { getMoodInfo } from '../shared/mood-data';

interface MatchedJournal {
  journal: Journal;
  collectionId: string;
  collectionName: string;
  moodEmoji: string;
  moodLabel: string;
}

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.scss']
})
export class SearchComponent implements OnInit, OnDestroy {
  searchControl = new FormControl('');
  collections: Collection[] = [];
  matchedCollections: Collection[] = [];
  matchedJournals: MatchedJournal[] = [];
  isLoading = false;
  hasSearched = false;

  private destroy$ = new Subject<void>();

  constructor(
    private collectionService: CollectionService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCollections();

    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => this.performSearch());
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private loadCollections() {
    this.isLoading = true;
    this.collectionService.getCollections().pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.collections = data.map((e: any) => e as Collection);
      this.isLoading = false;
    });
  }

  performSearch() {
    const query = (this.searchControl.value || '').toLowerCase().trim();
    if (!query) {
      this.matchedCollections = [];
      this.matchedJournals = [];
      this.hasSearched = false;
      return;
    }

    this.hasSearched = true;

    // Search collections
    this.matchedCollections = this.collections.filter(c =>
      c.name.toLowerCase().includes(query) ||
      (c.description && c.description.toLowerCase().includes(query))
    );

    // Search journals across all collections
    this.matchedJournals = [];
    for (const col of this.collections) {
      if (col.journals) {
        for (const j of col.journals) {
          if (
            j.title.toLowerCase().includes(query) ||
            (j.content && j.content.toLowerCase().includes(query))
          ) {
            const info = getMoodInfo(j.mood);
            this.matchedJournals.push({
              journal: j,
              collectionId: col.id,
              collectionName: col.name,
              moodEmoji: info?.emoji ?? '',
              moodLabel: info?.label ?? ''
            });
          }
        }
      }
    }
  }

  navigateToCollection(collection: Collection) {
    this.router.navigate(['/collections', collection.id, 'journals', collection.name]);
  }

  navigateToJournal(match: MatchedJournal) {
    this.router.navigate(['create-journal', match.collectionId, match.journal.id, match.collectionName]);
  }
}
