import { Component, OnInit, OnDestroy, HostListener, ElementRef, QueryList, ViewChildren } from '@angular/core';
import { Router } from '@angular/router';
import { trigger, transition, style, animate, query, stagger, state } from '@angular/animations';
import { take } from 'rxjs';
import { AuthService } from '../services/auth.service';
import { ThemeService } from '../services/theme.service';

@Component({
    selector: 'app-landing',
    templateUrl: './landing.component.html',
    styleUrls: ['./landing.component.scss'],
    animations: [
        trigger('fadeUp', [
            state('hidden', style({ opacity: 0, transform: 'translateY(40px)' })),
            state('visible', style({ opacity: 1, transform: 'translateY(0)' })),
            transition('hidden => visible', animate('600ms cubic-bezier(0.16, 1, 0.3, 1)')),
        ]),
        trigger('staggerIn', [
            transition(':enter', [
                query('.feature-card', [
                    style({ opacity: 0, transform: 'translateY(30px)' }),
                    stagger('120ms', [
                        animate('500ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
                    ])
                ], { optional: true })
            ])
        ]),
        trigger('staggerSteps', [
            transition(':enter', [
                query('.step-card', [
                    style({ opacity: 0, transform: 'translateY(30px)' }),
                    stagger('200ms', [
                        animate('500ms cubic-bezier(0.16, 1, 0.3, 1)', style({ opacity: 1, transform: 'translateY(0)' }))
                    ])
                ], { optional: true })
            ])
        ]),
    ]
})
export class LandingComponent implements OnInit, OnDestroy {
    navScrolled = false;
    activeMoodIndex = 0;
    private moodInterval: ReturnType<typeof setInterval> | null = null;
    private observer: IntersectionObserver | null = null;

    sectionStates: Record<string, string> = {
        features: 'hidden',
        moods: 'hidden',
        howItWorks: 'hidden',
        cta: 'hidden',
    };

    moods = [
        { emoji: '😊', label: 'Happy' },
        { emoji: '😢', label: 'Sad' },
        { emoji: '😠', label: 'Angry' },
        { emoji: '😰', label: 'Anxious' },
        { emoji: '😌', label: 'Calm' },
        { emoji: '🥳', label: 'Excited' },
        { emoji: '😴', label: 'Tired' },
        { emoji: '🤔', label: 'Thoughtful' },
        { emoji: '😍', label: 'Loved' },
        { emoji: '😤', label: 'Frustrated' },
        { emoji: '🥺', label: 'Vulnerable' },
        { emoji: '😎', label: 'Confident' },
        { emoji: '🤗', label: 'Grateful' },
        { emoji: '😶', label: 'Numb' },
        { emoji: '🌀', label: 'Confused' },
        { emoji: '✨', label: 'Inspired' },
    ];

    features = [
        { icon: 'folder_special', title: 'Dimension Vaults', description: 'Organize your thoughts into themed collections — personal portals to different corners of your mind.', accent: 'green' },
        { icon: 'auto_stories', title: 'Journal Entries', description: 'Capture your thoughts, ideas, and reflections in dedicated entries within each collection.', accent: 'blue' },
        { icon: 'mood', title: 'Multi-Mood Tagging', description: 'Tag entries with multiple moods at once and set a primary mood. Track how you feel across your multiverse.', accent: 'purple' },
        { icon: 'search', title: 'Search & Sort', description: 'Quickly find collections and journal entries with instant search, sorting by date or name, and pagination.', accent: 'blue' },
        { icon: 'dark_mode', title: 'Dark & Light Portals', description: 'Seamlessly switch between dark cosmic mode and clean light theme — your universe, your rules.', accent: 'purple' },
        { icon: 'lock', title: 'Secure & Private', description: 'Your thoughts are yours alone. Sign-in protected with Firebase auth — each user sees only their own dimensions.', accent: 'green' },
    ];

    steps = [
        { number: 1, icon: 'rocket_launch', title: 'Create Your Vault', description: 'Set up your first collection — a dimension to hold your thoughts.' },
        { number: 2, icon: 'widgets', title: 'Build Collections', description: 'Organize vaults by theme, mood, or whatever feels right in your multiverse.' },
        { number: 3, icon: 'edit_note', title: 'Start Journaling', description: 'Write entries, tag moods, and watch your thought universe expand.' },
    ];

    @ViewChildren('observeSection') observeSections!: QueryList<ElementRef>;

    constructor(
        private authService: AuthService,
        public themeService: ThemeService,
        private router: Router,
    ) {}

    ngOnInit(): void {
        this.authService.isLoggedIn().pipe(take(1)).subscribe(loggedIn => {
            if (loggedIn) this.router.navigate(['/collections']);
        });

        this.moodInterval = setInterval(() => {
            this.activeMoodIndex = (this.activeMoodIndex + 1) % this.moods.length;
        }, 2000);

        this.setupObserver();
    }

    ngOnDestroy(): void {
        if (this.moodInterval) clearInterval(this.moodInterval);
        if (this.observer) this.observer.disconnect();
    }

    @HostListener('window:scroll')
    onScroll(): void {
        this.navScrolled = window.scrollY > 50;
    }

    setActiveMood(index: number): void {
        this.activeMoodIndex = index;
    }

    private setupObserver(): void {
        this.observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        const id = (entry.target as HTMLElement).dataset['section'];
                        if (id && this.sectionStates[id] === 'hidden') {
                            this.sectionStates[id] = 'visible';
                        }
                    }
                });
            },
            { threshold: 0.15 }
        );

        setTimeout(() => {
            this.observeSections?.forEach((el) => {
                this.observer!.observe(el.nativeElement);
            });
        });
    }
}
