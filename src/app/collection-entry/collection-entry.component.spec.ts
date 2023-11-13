import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CollectionEntryComponent } from './collection-entry.component';

describe('CollectionEntryComponent', () => {
  let component: CollectionEntryComponent;
  let fixture: ComponentFixture<CollectionEntryComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CollectionEntryComponent]
    });
    fixture = TestBed.createComponent(CollectionEntryComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
