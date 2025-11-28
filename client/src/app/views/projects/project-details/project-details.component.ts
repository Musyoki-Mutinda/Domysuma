import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { ProjectsService, Project } from '../projects.service';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent implements OnInit {
  project: Project | undefined;
  similarProjects: Project[] = [];

  constructor(
    private route: ActivatedRoute,
    private projectsService: ProjectsService
  ) {}

  ngOnInit(): void {
    const category = this.route.snapshot.paramMap.get('category');
    const projectId = this.route.snapshot.paramMap.get('id');

    if (projectId) {
      this.project = this.projectsService.getProjectById(projectId);
    }

    if (category && this.project) {
      this.similarProjects = this.projectsService
        .getProjectsByCategory(category)
        .filter(p => p.id !== this.project!.id); // exclude current project
    }
  }
}
