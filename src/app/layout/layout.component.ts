import { Component } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { Router } from '@angular/router';

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss']
})
export class LayoutComponent {
    sidenavOpened = true;

    constructor(private authService: AuthService, private router: Router) { }

    logout() {
        this.authService.logout();
    }

    toggleSidenav() {
        this.sidenavOpened = !this.sidenavOpened;
    }
}
