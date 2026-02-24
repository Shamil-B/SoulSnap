// collection-list.component.ts

import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { CollectionService } from '../services/collection.service';
import { Collection } from '../interfaces/collections';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-collection-list',
  templateUrl: './collection-list.component.html',
  styleUrls: ['./collection-list.component.scss'],
})
export class CollectionListComponent implements OnInit {
  collections: Collection[] = [];
  isLoading = false;

  constructor(
    private collectionService: CollectionService,
    private router: Router,
    private authService: AuthService
  ) { }

  ngOnInit(): void {
    if (this.authService.isLoggedIn()) {
      this.loadCollections();
    } else {
      this.router.navigate(['/login']);
    }
  }

  loadCollections() {
    this.isLoading = true;
    this.collectionService.getCollections().subscribe((data) => {
      this.collections = data.map((e: any) => e as Collection);
      this.isLoading = false;
    });
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
    try {
      this.collectionService.deleteCollection(collectionId);
    } catch (error) {
      console.log(error);
    }
  }

  createCollection() {
    this.router.navigate(['/create-collection', '-1', '']);
  }
}
