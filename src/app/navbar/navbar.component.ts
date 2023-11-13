import { Component, Input, Output } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.scss']
})
export class NavbarComponent {

  @Input() collectionId: string = "";
  @Output() collectionIdChange = this.collectionId;

  constructor(private router: Router) { }
  navigateToCreateJournal(){
    // Navigate to the create journal page
    this.router.navigate(['create-journal', this.collectionId,"0"]);
  }
}
