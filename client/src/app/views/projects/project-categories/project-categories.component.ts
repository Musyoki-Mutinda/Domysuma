import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { PROJECT_CATEGORIES } from 'src/app/shared/data/project-categories.data';

@Component({
  selector: 'app-project-categories',
  templateUrl: './project-categories.component.html',
  styleUrls: ['./project-categories.component.scss']
})
export class ProjectCategoriesComponent {

  constructor(private router: Router) {}

  // Use shared data instead of inline array
  categories = PROJECT_CATEGORIES;

  openCategory(slug: string) {
    this.router.navigate(['/projects', slug]);
  }
}
