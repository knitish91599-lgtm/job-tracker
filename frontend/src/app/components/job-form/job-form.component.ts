import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { JobApplicationService } from '../../services/job-application.service';
import { JobApplication } from '../../models/job-application.model';

@Component({
  selector: 'app-job-form',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="form-page">
      <div class="form-container">
        <h1>{{ isEdit ? 'Edit Application' : 'New Application' }}</h1>
        <p class="subtitle">{{ isEdit ? 'Update your job application details' : 'Track a new job application' }}</p>

        <form (ngSubmit)="onSubmit()" class="job-form">
          <div class="form-grid">
            <div class="form-group">
              <label>Company Name *</label>
              <input type="text" [(ngModel)]="job.companyName" name="companyName"
                     placeholder="e.g. Google, Microsoft" required>
            </div>
            <div class="form-group">
              <label>Role / Position *</label>
              <input type="text" [(ngModel)]="job.role" name="role"
                     placeholder="e.g. Senior Software Engineer" required>
            </div>
            <div class="form-group">
              <label>Status</label>
              <select [(ngModel)]="job.status" name="status">
                <option value="Applied">Applied</option>
                <option value="Phone Screen">Phone Screen</option>
                <option value="Technical">Technical Round</option>
                <option value="Onsite">Onsite</option>
                <option value="Interview">Interview</option>
                <option value="Offer">Offer</option>
                <option value="Rejected">Rejected</option>
                <option value="Withdrawn">Withdrawn</option>
              </select>
            </div>
            <div class="form-group">
              <label>Applied Date & Time</label>
              <input type="datetime-local" [(ngModel)]="appliedDateStr" name="appliedDateTime">
            </div>
            <div class="form-group">
              <label>Resume Version</label>
              <input type="text" [(ngModel)]="job.resumeVersion" name="resumeVersion"
                     placeholder="e.g. v3.2 - Full Stack">
            </div>
            <div class="form-group">
              <label>Email Used</label>
              <input type="email" [(ngModel)]="job.emailUsed" name="emailUsed"
                     placeholder="you@email.com">
            </div>
            <div class="form-group">
              <label>Job Link URL</label>
              <input type="url" [(ngModel)]="job.jobLinkUrl" name="jobLinkUrl"
                     placeholder="https://careers.company.com/job/123">
            </div>
            <div class="form-group">
              <label>Platform</label>
              <select [(ngModel)]="job.platform" name="platform">
                <option value="">Select Platform</option>
                <option value="LinkedIn">LinkedIn</option>
                <option value="Indeed">Indeed</option>
                <option value="Glassdoor">Glassdoor</option>
                <option value="Company Website">Company Website</option>
                <option value="Referral">Referral</option>
                <option value="AngelList">AngelList</option>
                <option value="Handshake">Handshake</option>
                <option value="Other">Other</option>
              </select>
            </div>
            <div class="form-group">
              <label>Location</label>
              <input type="text" [(ngModel)]="job.location" name="location"
                     placeholder="e.g. Remote, San Francisco, CA">
            </div>
            <div class="form-group">
              <label>Salary Range</label>
              <input type="text" [(ngModel)]="job.salary" name="salary"
                     placeholder="e.g. $120k - $160k">
            </div>
          </div>

          <div class="form-group full-width">
            <label>Job Description</label>
            <textarea [(ngModel)]="job.jobDescription" name="jobDescription" rows="5"
                      placeholder="Paste the job description here for reference..."></textarea>
          </div>

          <div class="form-group full-width">
            <label>Notes</label>
            <textarea [(ngModel)]="job.notes" name="notes" rows="3"
                      placeholder="Any additional notes, recruiter contact, etc."></textarea>
          </div>

          <div class="form-actions">
            <button type="button" class="btn-cancel" (click)="onCancel()">Cancel</button>
            <button type="submit" class="btn-save" [disabled]="loading">
              {{ loading ? 'Saving...' : (isEdit ? 'Update Application' : 'Save Application') }}
            </button>
          </div>
        </form>

        <div class="error-msg" *ngIf="errorMessage">{{ errorMessage }}</div>
      </div>
    </div>
  `,
  styles: [`
    .form-page { padding: 28px; max-width: 900px; margin: 0 auto; }
    .form-container {
      background: rgba(255,255,255,0.03);
      border: 1px solid rgba(255,255,255,0.06);
      border-radius: 16px; padding: 32px;
    }
    h1 {
      font-size: 24px; font-weight: 700; color: #e2e8f0;
      margin: 0 0 4px;
    }
    .subtitle { color: #64748b; font-size: 14px; margin: 0 0 28px; }

    .form-grid {
      display: grid; grid-template-columns: 1fr 1fr; gap: 20px;
      margin-bottom: 20px;
    }
    .form-group { display: flex; flex-direction: column; }
    .form-group.full-width { margin-bottom: 20px; }
    .form-group label {
      color: #94a3b8; font-size: 13px; font-weight: 500;
      margin-bottom: 6px;
    }
    .form-group input,
    .form-group select,
    .form-group textarea {
      padding: 10px 14px;
      background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1);
      border-radius: 10px; color: #e2e8f0;
      font-size: 14px; outline: none;
      transition: border-color 0.2s;
      font-family: inherit;
    }
    .form-group input:focus,
    .form-group select:focus,
    .form-group textarea:focus {
      border-color: #6366f1;
    }
    .form-group input::placeholder,
    .form-group textarea::placeholder { color: #475569; }
    .form-group select option { background: #1e1e3f; color: #e2e8f0; }
    textarea { resize: vertical; }

    .form-actions {
      display: flex; gap: 12px; justify-content: flex-end;
      margin-top: 8px;
    }
    .btn-cancel {
      padding: 10px 24px; background: rgba(255,255,255,0.05);
      border: 1px solid rgba(255,255,255,0.1); border-radius: 10px;
      color: #94a3b8; font-size: 14px; cursor: pointer;
      transition: all 0.2s;
    }
    .btn-cancel:hover { background: rgba(255,255,255,0.08); }
    .btn-save {
      padding: 10px 24px; background: #6366f1; color: white;
      border: none; border-radius: 10px; font-size: 14px;
      font-weight: 600; cursor: pointer; transition: background 0.2s;
    }
    .btn-save:hover { background: #4f46e5; }
    .btn-save:disabled { opacity: 0.6; cursor: not-allowed; }

    .error-msg {
      color: #f87171; font-size: 13px; margin-top: 16px;
      padding: 10px; background: rgba(248,113,113,0.1);
      border-radius: 8px; text-align: center;
    }

    @media (max-width: 640px) {
      .form-grid { grid-template-columns: 1fr; }
    }
  `]
})
export class JobFormComponent implements OnInit {
  job: JobApplication = {
    companyName: '', role: '', status: 'Applied',
    jobDescription: '', resumeVersion: '', jobLinkUrl: '',
    emailUsed: '', platform: '', notes: '', salary: '', location: ''
  };
  appliedDateStr = '';
  isEdit = false;
  editId: number | null = null;
  loading = false;
  errorMessage = '';

  constructor(
    private jobService: JobApplicationService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEdit = true;
      this.editId = +id;
      this.jobService.getById(this.editId).subscribe({
        next: (job) => {
          this.job = job;
          if (job.appliedDateTime) {
            this.appliedDateStr = job.appliedDateTime.substring(0, 16);
          }
        },
        error: () => { this.errorMessage = 'Failed to load application'; }
      });
    } else {
      // Default to now
      const now = new Date();
      this.appliedDateStr = now.toISOString().substring(0, 16);
    }
  }

  onSubmit() {
    if (!this.job.companyName || !this.job.role) {
      this.errorMessage = 'Company name and role are required';
      return;
    }

    this.loading = true;
    this.errorMessage = '';

    if (this.appliedDateStr) {
      this.job.appliedDateTime = this.appliedDateStr + ':00';
    }

    if (this.isEdit && this.editId) {
      this.jobService.update(this.editId, this.job).subscribe({
        next: () => { this.router.navigate(['/applications']); },
        error: (err) => {
          this.errorMessage = 'Failed to update';
          this.loading = false;
        }
      });
    } else {
      this.jobService.create(this.job).subscribe({
        next: () => { this.router.navigate(['/applications']); },
        error: (err) => {
          this.errorMessage = 'Failed to save';
          this.loading = false;
        }
      });
    }
  }

  onCancel() {
    this.router.navigate(['/applications']);
  }
}
