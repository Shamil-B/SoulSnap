import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { Subject, debounceTime, distinctUntilChanged, takeUntil } from 'rxjs';
import { trigger, transition, style, animate } from '@angular/animations';
import { CollectionService } from '../services/collection.service';
import { Collection } from '../interfaces/collections';
import { AuthService } from '../services/auth.service';
import { ConfirmDialogComponent } from '../shared/confirm-dialog/confirm-dialog.component';

@Component({
  selector: 'app-collection-list',
  templateUrl: './collection-list.component.html',
  styleUrls: ['./collection-list.component.scss'],
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
export class CollectionListComponent implements OnInit, OnDestroy {
  collections: Collection[] = [];
  filteredCollections: Collection[] = [];
  pagedCollections: Collection[] = [];
  isLoading = false;

  searchControl = new FormControl('');
  sortMode: 'name' | 'newest' | 'oldest' = 'newest';

  // Pagination
  pageSize = 6;
  pageIndex = 0;
  totalItems = 0;

  private destroy$ = new Subject<void>();

  constructor(
    private collectionService: CollectionService,
    private router: Router,
    private authService: AuthService,
    private dialog: MatDialog
  ) { }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) { this.loadCollections(); }
    else { this.router.navigate(['/login']); }

    this.searchControl.valueChanges.pipe(
      debounceTime(300),
      distinctUntilChanged(),
      takeUntil(this.destroy$)
    ).subscribe(() => this.applyFilterAndSort());
  }

  ngOnDestroy(): void { this.destroy$.next(); this.destroy$.complete(); }

  loadCollections() {
    this.isLoading = true;
    this.collectionService.getCollections().pipe(takeUntil(this.destroy$)).subscribe((data) => {
      this.collections = data.map((e: any) => e as Collection);
      this.applyFilterAndSort();
      this.isLoading = false;
    });
  }

  applyFilterAndSort() {
    let result = [...this.collections];

    // Filter
    const query = (this.searchControl.value || '').toLowerCase().trim();
    if (query) {
      result = result.filter(c =>
        c.name.toLowerCase().includes(query) ||
        (c.description && c.description.toLowerCase().includes(query))
      );
    }

    // Sort
    switch (this.sortMode) {
      case 'name': result.sort((a, b) => a.name.localeCompare(b.name)); break;
      case 'newest': result.sort((a, b) => new Date(b.creationDate).getTime() - new Date(a.creationDate).getTime()); break;
      case 'oldest': result.sort((a, b) => new Date(a.creationDate).getTime() - new Date(b.creationDate).getTime()); break;
    }

    this.filteredCollections = result;
    this.totalItems = result.length;
    this.pageIndex = 0;
    this.updatePage();
  }

  onSortChange(mode: string) {
    this.sortMode = mode as any;
    this.applyFilterAndSort();
  }

  onPageChange(event: PageEvent) {
    this.pageSize = event.pageSize;
    this.pageIndex = event.pageIndex;
    this.updatePage();
  }

  private updatePage() {
    const start = this.pageIndex * this.pageSize;
    this.pagedCollections = this.filteredCollections.slice(start, start + this.pageSize);
  }

  navigateToCollection(collection: Collection) {
    this.router.navigate(['/collections', collection.id, 'journals', collection.name]);
  }

  editCollecion(collectionId: string, event: Event, title: string) {
    event.stopPropagation();
    this.router.navigate(['/create-collection', collectionId, title]);
  }

  deleteCollection(collectionId: string, event: Event) {
    event.stopPropagation();
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      panelClass: 'cosmic-dialog',
      data: {
        title: 'Delete Collection?',
        message: 'This will obliterate this entire dimension vault and all its journals. There\'s no coming back from this one, Morty.',
        confirmText: 'Obliterate',
      }
    });
    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        try { this.collectionService.deleteCollection(collectionId); } catch (error) { console.log(error); }
      }
    });
  }

  createCollection() { this.router.navigate(['/create-collection', '-1', '']); }
}
