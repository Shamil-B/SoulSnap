// collection-form.component.ts

import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { CollectionService } from '../services/collection.service';
import { Collection } from '../interfaces/collections';
import { generateUniqueId } from '../utilities/generate-id';

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
  };

  isEditing = false;

  constructor(private route: ActivatedRoute, private router: Router, private collectionService: CollectionService) {}

  ngOnInit(): void {
    this.checkEditMode();
  }

  checkEditMode() {
    const collectionId = this.route.snapshot.paramMap.get('collectionId');
    if (collectionId && collectionId !== '-1') {
      // Editing an existing collection
      this.isEditing = true;
      const existingCollection = this.collectionService.getCollectionById(collectionId);
      if (existingCollection) {
        this.collection = { ...existingCollection };
      } else {
        // Handle case where the collection is not found
      }
    }
  }

  onSubmit() {
    if (this.isEditing) {
      // Update existing collection
      this.collectionService.updateCollection(this.collection);
    } else {
      // Create new collection
      this.collectionService.addCollection({ ...this.collection, id: generateUniqueId() });
    }

    // Navigate back to the collection list (replace 'collections' with your actual route)
    this.router.navigate(['/collections']);
  }
}
