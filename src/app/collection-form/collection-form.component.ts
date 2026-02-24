// collection-form.component.ts

import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
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
  collectionForm: FormGroup;
  isEditing = false;
  title = '';
  private collectionId = '';

  constructor(
    private fb: FormBuilder,
    private route: ActivatedRoute,
    private router: Router,
    private collectionService: CollectionService,
    private authService: AuthService
  ) {
    this.collectionForm = this.fb.group({
      name: ['', [Validators.required, Validators.maxLength(50)]],
      description: ['', [Validators.required]]
    });
  }

  ngOnInit(): void {
    this.title = this.route.snapshot.paramMap.get('title') || 'Create Collection';
    if (this.authService.isLoggedIn()) {
      this.checkEditMode();
    } else {
      this.router.navigate(['/login']);
    }
  }

  checkEditMode() {
    const collectionId = this.route.snapshot.paramMap.get('collectionId');
    if (collectionId && collectionId !== '-1') {
      this.isEditing = true;
      this.collectionId = collectionId;
      this.collectionService.getCollectionById(collectionId).forEach((collection) => {
        if (collection) {
          this.collectionForm.patchValue({
            name: collection.name,
            description: collection.description
          });
        }
      });
    }
  }

  onSubmit() {
    if (this.collectionForm.invalid) {
      this.collectionForm.markAllAsTouched();
      return;
    }

    const formValue = this.collectionForm.value;

    if (this.isEditing) {
      const updated: Collection = {
        id: this.collectionId,
        name: formValue.name,
        description: formValue.description,
        creationDate: new Date(),
        journals: [],
        creator_email: ''
      };
      this.collectionService.updateCollection(updated);
    } else {
      const newCollection: Collection = {
        id: generateUniqueId(),
        name: formValue.name,
        description: formValue.description,
        creationDate: new Date(),
        journals: [],
        creator_email: ''
      };
      this.collectionService.addCollection(newCollection);
    }
    this.router.navigate(['/collections']);
  }
}
