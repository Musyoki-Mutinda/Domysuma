import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { ProjectService } from '../project.service';

@Component({
  selector: 'app-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class ListComponent implements OnInit {

  projects: any[] = [];
  isLoading = false;
  error: string | null = null;

  constructor(private projectService: ProjectService, private router: Router) { }

  ngOnInit(): void {
    this.loadProjects();
  }

  loadProjects(): void {
    this.isLoading = true;
    this.error = null;

    // Use admin endpoint to see ALL projects
    this.projectService.getAllProjectsAdmin().subscribe(
      (response: any) => {
        console.log('Loaded all projects (admin view):', response);
        this.projects = response.data || response;
        this.isLoading = false;
      },
      (error) => {
        console.error('Error loading projects:', error);
        this.error = 'Failed to load projects. Please try again.';
        this.isLoading = false;
      }
    );
  }

  editProject(project: any): void {
    // Navigate to create component with project id for editing
    this.router.navigate(['/projects/create', project.id]);
  }

  toggleVisibility(projectId: number, currentStatus: boolean): void {
    const action = currentStatus ? 'hide' : 'publish';
    if (confirm(`Are you sure you want to ${action} this project?`)) {
      this.projectService.toggleProjectVisibility(projectId).subscribe(
        (response) => {
          console.log('Toggle response:', response);
          alert(`Project ${action}den successfully!`);
          this.loadProjects(); // Reload the list
        },
        (error) => {
          console.error('Error toggling visibility:', error);
          alert('Failed to toggle visibility. Please try again.');
        }
      );
    }
  }

  // Keep delete for future use
  deleteProject(project: any): void {
    alert('Delete functionality is temporarily disabled. Please use Hide instead.');
  }

}
