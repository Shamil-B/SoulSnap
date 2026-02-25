import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';

export interface ConfirmDialogData {
    title: string;
    message: string;
    confirmText?: string;
    cancelText?: string;
}

@Component({
    selector: 'app-confirm-dialog',
    template: `
    <div class="confirm-dialog">
      <h2 class="dialog-title">{{ data.title }}</h2>
      <p class="dialog-message">{{ data.message }}</p>
      <div class="dialog-actions">
        <button mat-button class="cancel-btn" (click)="dialogRef.close(false)">
          {{ data.cancelText || 'Cancel' }}
        </button>
        <button mat-flat-button class="confirm-btn" (click)="dialogRef.close(true)">
          <mat-icon>warning</mat-icon>
          {{ data.confirmText || 'Delete' }}
        </button>
      </div>
    </div>
  `,
    styles: [`
    .confirm-dialog {
      padding: var(--space-lg);
      background: var(--bg-elevated);
      border-radius: var(--radius-md);
    }
    .dialog-title {
      font-family: 'Orbitron', sans-serif;
      font-size: 1.2rem;
      color: var(--text-primary);
      margin-bottom: var(--space-md);
    }
    .dialog-message {
      color: var(--text-secondary);
      font-size: 0.95rem;
      line-height: 1.6;
      margin-bottom: var(--space-xl);
    }
    .dialog-actions {
      display: flex;
      justify-content: flex-end;
      gap: var(--space-md);
    }
    .cancel-btn {
      color: var(--text-secondary) !important;
      font-weight: 500 !important;
    }
    .confirm-btn {
      display: flex;
      align-items: center;
      gap: 6px;
      background: linear-gradient(135deg, var(--neon-pink), #cc1144) !important;
      color: white !important;
      font-weight: 600 !important;
      border-radius: var(--radius-sm) !important;
      mat-icon { font-size: 1rem; width: 18px; height: 18px; }
    }
  `]
})
export class ConfirmDialogComponent {
    constructor(
        public dialogRef: MatDialogRef<ConfirmDialogComponent>,
        @Inject(MAT_DIALOG_DATA) public data: ConfirmDialogData
    ) { }
}
