// collection-form.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CollectionService } from '../services/collection.service';
import { Collection } from '../interfaces/collections';
import { generateUniqueId } from '../utilities/generate-id';
import { AuthService } from '../services/auth.service';

@Component({
  selector: 'app-collection-form',
  templateUrl: './collection-form.component.html',
  styleUrls: ['./collection-form.component.scss'],
})
export class CollectionFormComponent implements OnInit {
  collection: Collection = {
    id: '', // You might generate a unique ID for new entries
    name: '',
    description: '',
    creationDate: new Date(),
    journals: [],
    creator_email:'', // Initialize with the collection ID (you need to fetch this from the route or service)
  };

  title : string = "";

  isEditing = false;

  constructor(private route: ActivatedRoute, private router: Router, private collectionService: CollectionService, private authService : AuthService) {}

  ngOnInit(): void {
    this.title = this.route.snapshot.paramMap.get('title') || "Create Collection";
    if(this.authService.isLoggedIn()){
      this.checkEditMode();
    }
    else{
      this.router.navigate(['/login']);
    }
  }

  checkEditMode() {
    const collectionId = this.route.snapshot.paramMap.get('collectionId');
    if (collectionId && collectionId !== '-1') {
      // Editing an existing collection
      this.isEditing = true;
      this.collectionService.getCollectionById(collectionId).forEach((collection) => {
        console.log(collection);
        if (collection) {
          this.collection = collection;
        }
      }
      );
    }
  }

  onSubmit() {
    if (this.isEditing) {
      // Update existing collection
      this.collectionService.updateCollection(this.collection);
    } else {
      // Create new collection
      this.collectionService.addCollection({ ...this.collection, id:generateUniqueId()});
    }
    // Navigate back to the collection list (replace 'collections' with your actual route)
    this.router.navigate(['/collections']);
  }
  
  logout(){
    this.authService.logout();
  }
}
