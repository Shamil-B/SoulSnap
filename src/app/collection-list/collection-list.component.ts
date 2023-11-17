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

  constructor(private collectionService: CollectionService, private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    if(this.authService.isLoggedIn()){
      this.loadCollections();
    }
    else{
      this.router.navigate(['/login']);
    }
  }
  loadCollections() {
    // Fetch collections from the service
    this.collections = this.collectionService.getCollections();
  }

  navigateToCollection(collectionId: string) {
    // Navigate to the details of the selected collection
    this.router.navigate(['/collections', collectionId,"journals"]);
  }

  editCollecion(collectionId: string) {
    // Navigate to the edit page of the selected collection
    this.router.navigate(['/create-collection', collectionId]);
  }

  deleteCollection(collectionId: string) {
    // Delete the selected collection
    this.collectionService.deleteCollection(collectionId);
    // Reload the collections
    this.loadCollections();
  }

  createCollection(){
    this.router.navigate(['/create-collection', '-1']);
  }

  logout(){
    this.authService.logout();
  }
}
