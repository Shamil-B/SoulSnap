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
    this.collectionService.getCollections().subscribe((data) => {
      this.collections = data.map((e : any) => {
        console.log(e as Collection[]);
        return e as Collection;
      });
    })
  }

  navigateToCollection(collection: Collection) {
    // Navigate to the details of the selected collection
    this.router.navigate(['/collections', collection.id,"journals", collection.name]);
  }

  editCollecion(collectionId: string, event : Event) {
    // Navigate to the edit page of the selected collection
    event.stopPropagation();
    this.router.navigate(['/create-collection', collectionId]);
  }

  deleteCollection(collectionId: string, event : Event) {
    event.stopPropagation();
    try{
      this.collectionService.deleteCollection(collectionId);
    }
    catch(error){
      console.log(error);
    }

  }
  
  createCollection(){
    this.router.navigate(['/create-collection', '-1']);
  }

  logout(){
    this.authService.logout();
  }
}
