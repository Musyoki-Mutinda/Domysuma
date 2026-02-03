import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment'; // ✅ ADD THIS LINE

export interface Project {
  id: number;
  title: string;
  description: string;
  location: string;
  category?: string;
  year?: string;
  clientType?: string;
  scope?: string[];
  galleryImages?: any[];
  architecturalDrawings?: any[];
  media?: any[];
  // Add other fields as needed
}

@Injectable({
  providedIn: 'root'
})
export class ProjectService {

  private baseUrl = `${environment.apiBaseUrl}/api/project`; // ✅ CHANGED THIS LINE

  constructor(private http: HttpClient) { }

  getProjectById(id: number): Observable<Project> {
    return this.http.get<Project>(`${this.baseUrl}/${id}`);
  }

  getProjects(): Observable<any> {
    return this.http.get(`${this.baseUrl}`);
  }
}