import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Project {
  id: string;
  category: string;
  title: string;
  img: string;           // Thumbnail image for cards
  desc: string;          // Short description for cards
  gallery: string[];
  summary: string;
  description: string;
  year: string;
  clientType: string;
  scope: string;
  county: string;
  totalFloorArea: string;
  structuralSystem: string;
  interiorFeatures: string;
  longDescription: string;
  designer: string;
  specs: {
    duration: string;
    location: string;
    cost: string;
  };
}

@Injectable({ providedIn: 'root' })
export class ProjectsService {
  private baseUrl = `${environment.apiBaseUrl}/api/project`;

  constructor(private http: HttpClient) {}

  getProjectById(id: string): Observable<Project> {
    return this.http.get<any>(`${this.baseUrl}/${id}`).pipe(
      map(apiProject => this.mapApiProjectToClient(apiProject))
    );
  }

  getAllProjects(): Observable<Project[]> {
    return this.http.get<any>(`${this.baseUrl}`).pipe(
      map(response => {
        const projects = response.data || response;
        return projects.map((p: any) => this.mapApiProjectToClient(p));
      })
    );
  }

  getProjectsByCategory(category: string): Observable<Project[]> {
    return this.getAllProjects().pipe(
      map(projects => projects.filter(p => p.category === category))
    );
  }

  private mapApiProjectToClient(apiProject: any): Project {
    // Handle both camelCase and snake_case field names
    const description = apiProject.description || apiProject.long_description || apiProject.longDescription || '';

    return {
      id: apiProject.id.toString(),
      category: apiProject.category || 'Residential',
      title: apiProject.title,
      img: apiProject.defaultImage?.path || 'assets/images/prj.png', // Default thumbnail
      desc: description?.substring(0, 100) + (description?.length > 100 ? '...' : '') || apiProject.title,
      gallery: apiProject.media?.map((m: any) => m.path) || [],
      summary: description || apiProject.title,
      description: description,
      year: apiProject.year || '',
      clientType: apiProject.clientType || apiProject.client_type || '',
      scope: apiProject.scope || '',
      county: apiProject.county || '',
      totalFloorArea: apiProject.totalFloorArea || '',
      structuralSystem: apiProject.structuralSystem || '',
      interiorFeatures: apiProject.interiorFeatures || '',
      longDescription: apiProject.longDescription || apiProject.long_description || '',
      designer: apiProject.designer || '',
      specs: {
        duration: apiProject.durationInMonths ? `${apiProject.durationInMonths} months` : 'N/A',
        location: apiProject.location || 'N/A',
        cost: 'Contact for pricing' // No cost field in current API
      }
    };
  }
}
