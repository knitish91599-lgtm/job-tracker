import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { JobApplicationService } from '../../services/job-application.service';
import { JobApplication } from '../../models/job-application.model';

@Component({
  selector: 'app-job-list',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink],
  template: `
    <div class="list-page">
      <div class="list-header">
        <h1>My Applications</h1>
        <button class="btn-add" routerLink="/add">+ New Application</button>
      </div>

      <!-- Filters -->
      <div class="filter-bar">
        <div class="search-box">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#64748b" stroke-width="2">
            <circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/>
          </svg>
          <input type="text" [(ngModel)]="searchQuery" (ngModelChange)="onSearch()"
                 placeholder="Search by company...">
        </div>
        <div class="filter-chips">
          <button class="chip" [class.active]="filterStatus === ''" (click)="onFilter('')">All</button>
          <button class="chip" [class.active]="filterStatus === 'Applied'" (click)="onFilter('Applied')">Applied</button>
          <button class="chip" [class.active]="filterStatus === 'Interview'" (click)="onFilter('Interview')">Interview</button>
          <button class="chip" [class.active]="filterStatus === 'Offer'" (click)="onFilter('Offer')">Offer</button>
          <button class="chip" [class.active]="filterStatus === 'Rejected'" (click)="onFilter('Rejected')">Rejected</button>
        </div>
      </div>

      <!-- Job Cards -->
      <div class="jobs-list">
        <div class="job-card" *ngFor="let job of filteredJobs">
          <div class="job-main">
            <div class="job-top">
              <span class="job-id">{{ job.jobId }}</span>
              <span class="status-badge"
                    [style.background]="getStatusColor(job.status || 'Applied') + '18'"
                    [style.color]="getStatusColor(job.status || 'Applied')">
                {{ job.status || 'Applied' }}
              </span>
            </div>
            <div class="job-company">{{ job.companyName }}</div>
            <div class="job-role">{{ job.role }}</div>
            <div class="job-meta">
              <span *ngIf="job.location" class="meta-item">
                <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                  <path d="M21 10c0 7-9 13-9 13s-9-6-9-13a9 9 0 0 1 18 0z"/><circle cx="12" cy="10" r="3"/>
                </svg>
                {{ job.location }}
              </span>
              <span *ngIf="job.platform" class="meta-item">{{ job.platform }}</span>
              <span *ngIf="job.resumeVersion" class="meta-item">Resume: {{ job.resumeVersion }}</span>
              <span *ngIf="job.emailUsed" class="meta-item">{{ job.emailUsed }}</span>
            </div>
            <div class="job-date">
              Applied: {{ job.appliedDateTime | date:'MMM d, yyyy h:mm a' }}
            </div>
          </div>
          <div class="job-actions">
            <a *ngIf="job.jobLinkUrl" [href]="job.jobLinkUrl" target="_blank" class="action-btn link">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
                <polyline points="15 3 21 3 21 9"/><line x1="10" y1="14" x2="21" y2="3"/>
              </svg>
            </a>
            <button class="action-btn edit" (click)="onEdit(job)">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
              </svg>
            </button>
            <button class="action-btn delete" (click)="onDelete(job)">
              <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
                <polyline points="3 6 5 6 21 6"/>
                <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
              </svg>
            </button>
          </div>
        </div>

        <div class="empty-state" *ngIf="filteredJobs.length === 0">
          <svg width="48" height="48" viewBox="0 0 24 24" fill="none" stroke="#475569" stroke-width="1.5">
            <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
            <rect x="8" y="2" width="8" height="4" rx="1"/>
          </svg>
          <h3>No applications found</h3>
          <p>{{ searchQuery || filterStatus ? 'Try changing your search or filter.' : 'Start tracking your job applications!' }}</p>
          <button class="btn-add" routerLink="/add" *ngIf="!searchQuery && !filterStatus">+ Add First Application</button>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .list-page { padding: 28px; max-width: 1000px; margin: 0 auto; }
    .list-header {
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: 24px;
    }
    .list-header h1 {
      font-size: 28px; font-weight: 700; color: #e2e8f0; margin: 0;
    }
    .btn-add {
      padding: 10px 20px; background: #6366f1; color: white;
      border: none; border-radius: 10px; font-size: 14px; font-weight: 600;
      cursor: pointer; text-decoration: none;
    }
    .btn-add:hover { background: #4f46e5; }

    .filter-bar {
      display: flex; gap: 16px; align-items: center;
      margin-bottom: 24px; flex-wrap: wrap;
    }
    .search-box {
      display: flex; align-items: center; gap: 8px;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 10px; padding: 8px 14px; flex: 1; min-width: 200px;
    }
    .search-box input {
      background: none; border: none; color: #e2e8f0;
      font-size: 14px; outline: none; width: 100%;
    }
    .search-box input::placeholder { color: #475569; }
    .filter-chips { display: flex; gap: 6px; }
    .chip {
      padding: 6px 14px; background: rgba(255,255,255,0.04);
      border: 1px solid rgba(255,255,255,0.08); border-radius: 8px;
      color: #94a3b8; font-size: 13px; cursor: pointer;
      transition: all 0.2s;
    }
    .chip:hover { background: rgba(255,255,255,0.06); }
    .chip.active {
      background: rgba(99,102,241,0.15); color: #a5b4fc;
      border-color: rgba(99,102,241,0.3);
    }

    .jobs-list { display: flex; flex-direction: column; gap: 12px; }
    .job-card {
      display: flex; justify-content: space-between; align-items: flex-start;
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 14px; padding: 20px;
      transition: border-color 0.2s;
    }
    .job-card:hover { border-color: rgba(255,255,255,0.12); }
    .job-main { flex: 1; }
    .job-top {
      display: flex; align-items: center; gap: 10px; margin-bottom: 6px;
    }
    .job-id { color: #64748b; font-size: 11px; font-family: monospace; }
    .status-badge {
      padding: 3px 10px; border-radius: 6px;
      font-size: 11px; font-weight: 600;
    }
    .job-company { font-size: 18px; font-weight: 700; color: #e2e8f0; }
    .job-role { color: #94a3b8; font-size: 14px; margin-top: 2px; }
    .job-meta {
      display: flex; gap: 14px; margin-top: 10px; flex-wrap: wrap;
    }
    .meta-item {
      display: flex; align-items: center; gap: 4px;
      color: #64748b; font-size: 12px;
    }
    .job-date { color: #475569; font-size: 12px; margin-top: 8px; }

    .job-actions {
      display: flex; gap: 6px; align-items: flex-start; padding-top: 4px;
    }
    .action-btn {
      width: 32px; height: 32px; display: flex; align-items: center;
      justify-content: center; border-radius: 8px; cursor: pointer;
      transition: all 0.2s; border: 1px solid transparent;
      background: rgba(255,255,255,0.04); color: #94a3b8;
      text-decoration: none;
    }
    .action-btn:hover { background: rgba(255,255,255,0.08); }
    .action-btn.link:hover { color: #6366f1; }
    .action-btn.edit:hover { color: #f59e0b; }
    .action-btn.delete:hover { color: #f87171; background: rgba(248,113,113,0.1); }

    .empty-state {
      text-align: center; padding: 60px 20px;
      color: #64748b;
    }
    .empty-state h3 { color: #94a3b8; margin: 16px 0 8px; }
    .empty-state p { font-size: 14px; margin-bottom: 20px; }

    @media (max-width: 640px) {
      .filter-bar { flex-direction: column; }
      .job-card { flex-direction: column; }
      .job-actions { margin-top: 12px; }
    }
  `]
})
export class JobListComponent implements OnInit {
  jobs: JobApplication[] = [];
  filteredJobs: JobApplication[] = [];
  searchQuery = '';
  filterStatus = '';

  constructor(private jobService: JobApplicationService, private router: Router) {}

  ngOnInit() {
    this.loadJobs();
  }

  loadJobs() {
    this.jobService.getAll().subscribe({
      next: (jobs) => {
        this.jobs = jobs;
        this.filteredJobs = jobs;
      }
    });
  }

  onSearch() {
    if (this.searchQuery.trim()) {
      this.jobService.search(this.searchQuery).subscribe({
        next: (jobs) => { this.filteredJobs = jobs; }
      });
    } else {
      this.filteredJobs = this.filterStatus
        ? this.jobs.filter(j => j.status === this.filterStatus)
        : this.jobs;
    }
  }

  onFilter(status: string) {
    this.filterStatus = status;
    this.searchQuery = '';
    if (status) {
      this.jobService.filterByStatus(status).subscribe({
        next: (jobs) => { this.filteredJobs = jobs; }
      });
    } else {
      this.filteredJobs = this.jobs;
    }
  }

  onEdit(job: JobApplication) {
    this.router.navigate(['/edit', job.id]);
  }

  onDelete(job: JobApplication) {
    if (confirm(`Delete application for ${job.companyName} - ${job.role}?`)) {
      this.jobService.delete(job.id!).subscribe({
        next: () => { this.loadJobs(); }
      });
    }
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      'Applied': '#6366f1', 'Interview': '#22d3ee', 'Offer': '#34d399',
      'Rejected': '#f87171', 'Withdrawn': '#94a3b8', 'Phone Screen': '#a78bfa',
      'Technical': '#f59e0b', 'Onsite': '#ec4899'
    };
    return colors[status] || '#6366f1';
  }
}
