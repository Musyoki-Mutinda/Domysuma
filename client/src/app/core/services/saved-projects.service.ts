import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class SavedProjectsService {

  private apiUrl = `${environment.apiBaseUrl}/api/project`;

  constructor(private http: HttpClient) { }

  saveProject(projectId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${projectId}/save`, {});
  }

  unsaveProject(projectId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${projectId}/save`);
  }

  isProjectSaved(projectId: number): Observable<{isSaved: boolean}> {
    return this.http.get<any>(`${this.apiUrl}/${projectId}/is-saved`).pipe(
      map(response => {
        // Handle ApiResponse format: {data: {isSaved: boolean}} or direct {isSaved: boolean}
        const data = response.data || response;
        return { isSaved: !!data.isSaved };
      })
    );
  }

  getSavedProjects(): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/saved`).pipe(
      map(response => {
        // Handle ApiResponse format: {data: [...]} or direct array
        const projects = response.data || response || [];
        return Array.isArray(projects) ? projects : [];
      })
    );
  }
}