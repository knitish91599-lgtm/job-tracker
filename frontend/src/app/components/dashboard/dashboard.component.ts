import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { JobApplicationService } from '../../services/job-application.service';
import { DashboardStats, JobApplication } from '../../models/job-application.model';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, RouterLink],
  template: `
    <div class="dashboard">
      <div class="dash-header">
        <h1>Dashboard</h1>
        <button class="btn-add" routerLink="/add">+ Add Application</button>
      </div>

      <!-- Stats Cards -->
      <div class="stats-grid">
        <div class="stat-card total">
          <div class="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M16 4h2a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H6a2 2 0 0 1-2-2V6a2 2 0 0 1 2-2h2"/>
              <rect x="8" y="2" width="8" height="4" rx="1"/>
            </svg>
          </div>
          <div class="stat-value">{{ stats?.totalApplications || 0 }}</div>
          <div class="stat-label">Total Applications</div>
        </div>
        <div class="stat-card week">
          <div class="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <rect x="3" y="4" width="18" height="18" rx="2"/>
              <line x1="16" y1="2" x2="16" y2="6"/><line x1="8" y1="2" x2="8" y2="6"/>
              <line x1="3" y1="10" x2="21" y2="10"/>
            </svg>
          </div>
          <div class="stat-value">{{ stats?.applicationsThisWeek || 0 }}</div>
          <div class="stat-label">This Week</div>
        </div>
        <div class="stat-card month">
          <div class="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/>
            </svg>
          </div>
          <div class="stat-value">{{ stats?.applicationsThisMonth || 0 }}</div>
          <div class="stat-label">This Month</div>
        </div>
        <div class="stat-card interview">
          <div class="stat-icon">
            <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2">
              <path d="M22 11.08V12a10 10 0 1 1-5.93-9.14"/>
              <polyline points="22 4 12 14.01 9 11.01"/>
            </svg>
          </div>
          <div class="stat-value">{{ getStatusCount('Interview') }}</div>
          <div class="stat-label">Interviews</div>
        </div>
      </div>

      <!-- Status Breakdown -->
      <div class="section-grid">
        <div class="section-card">
          <h2>Status Breakdown</h2>
          <div class="status-bars">
            <div class="status-bar-item" *ngFor="let entry of statusEntries">
              <div class="status-bar-header">
                <span class="status-dot" [style.background]="getStatusColor(entry.key)"></span>
                <span class="status-name">{{ entry.key }}</span>
                <span class="status-count">{{ entry.value }}</span>
              </div>
              <div class="bar-track">
                <div class="bar-fill" [style.width.%]="getBarWidth(entry.value)"
                     [style.background]="getStatusColor(entry.key)"></div>
              </div>
            </div>
            <div *ngIf="statusEntries.length === 0" class="empty-state">
              No applications yet. Start tracking!
            </div>
          </div>
        </div>

        <div class="section-card">
          <h2>Recent Applications</h2>
          <div class="recent-list">
            <div class="recent-item" *ngFor="let job of recentJobs">
              <div class="recent-info">
                <div class="recent-company">{{ job.companyName }}</div>
                <div class="recent-role">{{ job.role }}</div>
              </div>
              <div class="recent-meta">
                <span class="status-badge" [style.background]="getStatusColor(job.status || 'Applied') + '22'"
                      [style.color]="getStatusColor(job.status || 'Applied')">
                  {{ job.status || 'Applied' }}
                </span>
                <span class="recent-date">{{ job.appliedDateTime | date:'MMM d' }}</span>
              </div>
            </div>
            <div *ngIf="recentJobs.length === 0" class="empty-state">
              No applications yet. <a routerLink="/add">Add your first one!</a>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .dashboard { padding: 28px; max-width: 1200px; margin: 0 auto; }
    .dash-header {
      display: flex; justify-content: space-between; align-items: center;
      margin-bottom: 28px;
    }
    .dash-header h1 {
      font-size: 28px; font-weight: 700; color: #e2e8f0;
      font-family: 'Segoe UI', system-ui, sans-serif; margin: 0;
    }
    .btn-add {
      padding: 10px 20px; background: #6366f1; color: white;
      border: none; border-radius: 10px; font-size: 14px; font-weight: 600;
      cursor: pointer; transition: background 0.2s;
    }
    .btn-add:hover { background: #4f46e5; }

    .stats-grid {
      display: grid; grid-template-columns: repeat(4, 1fr); gap: 16px;
      margin-bottom: 28px;
    }
    .stat-card {
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 14px; padding: 20px;
    }
    .stat-icon { color: #6366f1; margin-bottom: 12px; }
    .stat-card.week .stat-icon { color: #22d3ee; }
    .stat-card.month .stat-icon { color: #a78bfa; }
    .stat-card.interview .stat-icon { color: #34d399; }
    .stat-value {
      font-size: 32px; font-weight: 700; color: #e2e8f0;
      font-family: 'Segoe UI', system-ui, sans-serif;
    }
    .stat-label { color: #64748b; font-size: 13px; margin-top: 4px; }

    .section-grid {
      display: grid; grid-template-columns: 1fr 1fr; gap: 20px;
    }
    .section-card {
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 14px; padding: 24px;
    }
    .section-card h2 {
      font-size: 16px; font-weight: 600; color: #e2e8f0;
      margin: 0 0 20px;
    }

    .status-bar-item { margin-bottom: 16px; }
    .status-bar-header {
      display: flex; align-items: center; gap: 8px;
      margin-bottom: 6px;
    }
    .status-dot {
      width: 8px; height: 8px; border-radius: 50%;
    }
    .status-name { color: #cbd5e1; font-size: 13px; flex: 1; }
    .status-count { color: #94a3b8; font-size: 13px; font-weight: 600; }
    .bar-track {
      height: 6px; background: rgba(255,255,255,0.05);
      border-radius: 3px; overflow: hidden;
    }
    .bar-fill {
      height: 100%; border-radius: 3px;
      transition: width 0.6s ease;
    }

    .recent-list { display: flex; flex-direction: column; gap: 12px; }
    .recent-item {
      display: flex; justify-content: space-between; align-items: center;
      padding: 12px; background: rgba(255,255,255,0.02);
      border-radius: 10px; border: 1px solid rgba(255,255,255,0.04);
    }
    .recent-company { color: #e2e8f0; font-size: 14px; font-weight: 600; }
    .recent-role { color: #64748b; font-size: 12px; margin-top: 2px; }
    .recent-meta { display: flex; align-items: center; gap: 10px; }
    .status-badge {
      padding: 4px 10px; border-radius: 6px;
      font-size: 11px; font-weight: 600;
    }
    .recent-date { color: #64748b; font-size: 12px; }

    .empty-state {
      color: #64748b; font-size: 14px; text-align: center; padding: 20px;
    }
    .empty-state a { color: #6366f1; text-decoration: none; }

    @media (max-width: 768px) {
      .stats-grid { grid-template-columns: repeat(2, 1fr); }
      .section-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class DashboardComponent implements OnInit {
  stats: DashboardStats | null = null;
  recentJobs: JobApplication[] = [];
  statusEntries: { key: string; value: number }[] = [];

  constructor(private jobService: JobApplicationService) {}

  ngOnInit() {
    this.loadStats();
    this.loadRecentJobs();
  }

  loadStats() {
    this.jobService.getStats().subscribe({
      next: (stats) => {
        this.stats = stats;
        this.statusEntries = Object.entries(stats.statusCounts || {})
          .map(([key, value]) => ({ key, value }))
          .sort((a, b) => b.value - a.value);
      },
      error: () => {}
    });
  }

  loadRecentJobs() {
    this.jobService.getAll().subscribe({
      next: (jobs) => { this.recentJobs = jobs.slice(0, 5); },
      error: () => {}
    });
  }

  getStatusCount(status: string): number {
    return this.stats?.statusCounts?.[status] || 0;
  }

  getBarWidth(count: number): number {
    const max = Math.max(...this.statusEntries.map(e => e.value), 1);
    return (count / max) * 100;
  }

  getStatusColor(status: string): string {
    const colors: Record<string, string> = {
      'Applied': '#6366f1',
      'Interview': '#22d3ee',
      'Offer': '#34d399',
      'Rejected': '#f87171',
      'Withdrawn': '#94a3b8',
      'Phone Screen': '#a78bfa',
      'Technical': '#f59e0b',
      'Onsite': '#ec4899'
    };
    return colors[status] || '#6366f1';
  }
}
