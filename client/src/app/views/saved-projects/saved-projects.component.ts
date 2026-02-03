import { Component, OnInit } from '@angular/core';
import { SavedProjectsService } from '../../core/services/saved-projects.service';
import { UserService } from '../../core/services/user.service';

@Component({
  selector: 'app-saved-projects',
  templateUrl: './saved-projects.component.html',
  styleUrls: ['./saved-projects.component.scss']
})
export class SavedProjectsComponent implements OnInit {

  savedProjects: any[] = [];
  loading = false;
  error: string | null = null;

  constructor(
    private savedProjectsService: SavedProjectsService,
    private userService: UserService
  ) { }

  ngOnInit(): void {
    this.loadSavedProjects();
  }

  loadSavedProjects(): void {
    this.loading = true;
    this.error = null;

    this.savedProjectsService.getSavedProjects().subscribe({
      next: (projects: any[]) => {
        this.savedProjects = projects;
        this.loading = false;
      },
      error: (err: any) => {
        console.error('Error loading saved projects:', err);
        this.error = 'Failed to load saved projects. Please try again.';
        this.loading = false;
      }
    });
  }

  onUnsaveProject(projectId: number): void {
    this.savedProjectsService.unsaveProject(projectId).subscribe({
      next: () => {
        // Remove from local list
        this.savedProjects = this.savedProjects.filter(p => p.id !== projectId);
      },
      error: (err: any) => {
        console.error('Error unsaving project:', err);
        // Optionally show error message
      }
    });
  }
}