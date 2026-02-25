import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { trigger, transition, style, animate, query, group } from '@angular/animations';
import { AuthService } from '../services/auth.service';
import { ThemeService } from '../services/theme.service';

const routeAnimation = trigger('routeAnimation', [
    transition('* <=> *', [
        query(':enter', [
            style({ opacity: 0, transform: 'translateY(12px)' })
        ], { optional: true }),
        group([
            query(':leave', [
                animate('200ms ease-out', style({ opacity: 0 }))
            ], { optional: true }),
            query(':enter', [
                animate('300ms 100ms ease-out', style({ opacity: 1, transform: 'translateY(0)' }))
            ], { optional: true }),
        ]),
    ]),
]);

@Component({
    selector: 'app-layout',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss'],
    animations: [routeAnimation]
})
export class LayoutComponent {
    constructor(private authService: AuthService, public themeService: ThemeService) { }
    prepareRoute(outlet: RouterOutlet) { return outlet?.isActivated ? outlet.activatedRoute?.snapshot?.url : ''; }
    logout() { this.authService.logout(); }
}
