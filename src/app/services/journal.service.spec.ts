import { TestBed } from '@angular/core/testing';
import { JournalService } from './journal.service';
import { Firestore, collection, collectionData, addDoc, updateDoc, deleteDoc, doc, getDoc } from '@angular/fire/firestore';


describe('JournalService', () => {
  let service: JournalService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(JournalService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
