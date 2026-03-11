import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { JobApplication, DashboardStats } from '../models/job-application.model';

@Injectable({ providedIn: 'root' })
export class JobApplicationService {
  private apiUrl = environment.apiUrl + '/jobs';

  constructor(private http: HttpClient) {}

  getAll(): Observable<JobApplication[]> {
    return this.http.get<JobApplication[]>(this.apiUrl);
  }

  getById(id: number): Observable<JobApplication> {
    return this.http.get<JobApplication>(`${this.apiUrl}/${id}`);
  }

  create(job: JobApplication): Observable<JobApplication> {
    return this.http.post<JobApplication>(this.apiUrl, job);
  }

  update(id: number, job: JobApplication): Observable<JobApplication> {
    return this.http.put<JobApplication>(`${this.apiUrl}/${id}`, job);
  }

  delete(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  search(query: string): Observable<JobApplication[]> {
    const params = new HttpParams().set('query', query);
    return this.http.get<JobApplication[]>(`${this.apiUrl}/search`, { params });
  }

  filterByStatus(status: string): Observable<JobApplication[]> {
    const params = new HttpParams().set('status', status);
    return this.http.get<JobApplication[]>(`${this.apiUrl}/filter`, { params });
  }

  getStats(): Observable<DashboardStats> {
    return this.http.get<DashboardStats>(`${this.apiUrl}/stats`);
  }
}
