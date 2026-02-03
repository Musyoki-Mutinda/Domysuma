import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

export interface ProjectCreate {
  projectTitle: string;
  category: string;
  briefDescription: string;
  countyTown: string;
  location: string;
  floorArea: string;
  structuralSystem: string;
  interiorFeatures: string;
  additionalNotes: string;
  yearCompleted: string;
  architectName: string;
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private baseUrl = `${environment.apiBaseUrl}/api/project`;  // CORRECT!

  constructor(private http: HttpClient) { }

  createProject(projectData: any): Observable<any> {
    return this.http.post(`${this.baseUrl}`, projectData);
  }

  // For admin - get ALL projects (published and hidden)
  getAllProjectsAdmin(): Observable<any> {
    return this.http.get(`${this.baseUrl}/admin/all`);
  }

  // For public - get only published projects (keeping original method for compatibility)
  getProjects(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }

  getProjectById(id: number): Observable<any> {
    return this.http.get(`${this.baseUrl}/${id}`);
  }

  updateProject(id: number, projectData: any): Observable<any> {
    return this.http.put(`${this.baseUrl}/${id}`, projectData);
  }

  deleteProject(id: number): Observable<any> {
    return this.http.delete(`${this.baseUrl}/${id}`);
  }

  toggleProjectVisibility(projectId: number): Observable<any> {
    return this.http.patch(`${this.baseUrl}/${projectId}/toggle-visibility`, {});
  }

  addProjectMedia(projectId: number, mediaData: any[]): Observable<any> {
    return this.http.post(`${this.baseUrl}/${projectId}/add-media`, mediaData);
  }
}