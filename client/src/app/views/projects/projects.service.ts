import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, map } from 'rxjs';
import { environment } from '../../../environments/environment';

export interface Project {
  id: string;
  category: string;
  title: string;
  img: string;
  desc: string;
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

  public mapApiProjectToClient(apiProject: any): Project {
    const description = apiProject.description || apiProject.long_description || apiProject.longDescription || '';

    // Handle both formats: array of objects with .path, or flat array of URL strings
    const mediaUrls: string[] = apiProject.media?.map((m: any) =>
      typeof m === 'string' ? m : m.path
    ) || apiProject.gallery || [];

    // Resolve thumbnail: prefer defaultImage, then first media item, then fallback
    const thumbnail =
      apiProject.defaultImage?.path ||
      mediaUrls[0] ||
      'assets/images/prj.png';

    return {
      id: apiProject.id.toString(),
      category: apiProject.category || 'Residential',
      title: apiProject.title,
      img: thumbnail,
      desc: description?.substring(0, 100) + (description?.length > 100 ? '...' : '') || apiProject.title,
      gallery: mediaUrls,
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
        cost: 'Contact for pricing'
      }
    };
  }
}