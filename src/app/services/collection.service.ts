// collection.service.ts

import { Injectable } from '@angular/core';
import { Collection } from '../interfaces/collections';
import { Observable } from 'rxjs';
import { inject } from '@angular/core';

import { collection, updateDoc, addDoc, doc, Firestore, collectionData, getDoc, deleteDoc } from '@angular/fire/firestore';
@Injectable({
  providedIn: 'root',
})
export class CollectionService {
  firestore: Firestore = inject(Firestore);
  
  // Get all collections
  getCollections() {
    const collectionInstance = collection(this.firestore,"Collections"); 
    return collectionData(collectionInstance, {idField: "id"});
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
      addDoc(collection(this.firestore,"Collections"), newCollection);
    } catch (error) {
      console.log(error);
    }
  }

  // Update an existing collection
  updateCollection(updatedCollection: Collection): void {
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
