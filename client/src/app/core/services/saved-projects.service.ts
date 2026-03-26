import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { environment } from '../../../environments/environment';
import { ProjectsService } from '../../views/projects/projects.service';

@Injectable({
  providedIn: 'root'
})
export class SavedProjectsService {

  private apiUrl = `${environment.apiBaseUrl}/api/project`;

  constructor(
    private http: HttpClient,
    private projectsService: ProjectsService
  ) { }

  saveProject(projectId: number): Observable<any> {
    return this.http.post(`${this.apiUrl}/${projectId}/save`, {});
  }

  unsaveProject(projectId: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${projectId}/save`);
  }

  isProjectSaved(projectId: number): Observable<{isSaved: boolean}> {
    return this.http.get<any>(`${this.apiUrl}/${projectId}/is-saved`).pipe(
      map(response => {
        const data = response.data || response;
        return { isSaved: !!data.isSaved };
      })
    );
  }

  getSavedProjects(): Observable<any[]> {
    return this.http.get<any>(`${this.apiUrl}/saved`).pipe(
      map(response => {
        const projects = response.data || response || [];
        const projectArray = Array.isArray(projects) ? projects : [];

        // Pass each project through the same mapper so thumbnails
        // resolve correctly from gallery images, just like the main projects pages
        return projectArray.map((p: any) =>
          this.projectsService.mapApiProjectToClient(p)
        );
      })
    );
  }
}