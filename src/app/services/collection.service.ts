// collection.service.ts

import { Injectable } from '@angular/core';
import { Collection } from '../interfaces/collections';
import { Observable } from 'rxjs';
import { inject } from '@angular/core';

import { collection, updateDoc, addDoc, doc, Firestore, collectionData, getDoc, deleteDoc, query, where } from '@angular/fire/firestore';
import { AuthService } from './auth.service';
@Injectable({
  providedIn: 'root',
})
export class CollectionService {
  firestore: Firestore = inject(Firestore);
  authService: AuthService = inject(AuthService);

  // Get all collections
  getCollections(): Observable<any[]> {
    const collectionInstance = collection(this.firestore, 'Collections');
    const email = this.authService.getUser();

    // Creating a query to filter documents by 'creator_email'
    const filteredQuery = query(collectionInstance, where('creator_email', '==', email));
    
    return collectionData(filteredQuery, { idField: 'id' });
  }

  // Get a specific collection by ID
  // Get a specific collection by ID
getCollectionById(id: string): Observable<Collection | undefined> {
  const collectionInstance = collection(this.firestore, 'Collections');
  const docRef = doc(collectionInstance, id);

  return new Observable<Collection | undefined>((observer) => {
    getDoc(docRef)
      .then((docSnapshot) => {
        if (docSnapshot.exists()) {
          const collectionData = docSnapshot.data() as Collection;
          // Assuming your Collection interface has an 'id' field
          collectionData.id = docSnapshot.id;
          observer.next(collectionData);
        } else {
          observer.next(undefined); // Collection with provided ID doesn't exist
        }
        observer.complete();
      })
      .catch((error) => {
        observer.error(error); // Handle error while fetching the document
      });
  });
}

  // collection is our document

  // Add a new collection
  addCollection(newCollection: Collection): void {
    try {
        const userEmail = this.authService.getUser();
        newCollection.creator_email = userEmail ?? '';
        addDoc(collection(this.firestore,"Collections"), newCollection);
  }
    catch(error){
      console.log(error);
    }
  }
  // Update an existing collection
  updateCollection(updatedCollection: Collection): void {
    console.log(updatedCollection);
    try{
      const docInstance = doc(collection(this.firestore,"Collections"), updatedCollection.id);
      updateDoc(docInstance, {...updatedCollection});
    }
    catch(error){
      console.log(error);
    }
  }

  // Delete a collection by ID
  deleteCollection(id: string): any {
    deleteDoc(doc(collection(this.firestore,"Collections"), id));
  }
}
