import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { ProjectsService } from '../projects.service';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit, OnDestroy {

  categorySlug!: string;
  selectedCategory: any = null;
  private pollingInterval: any;

  categories = [
    { name: 'Residential Homes', slug: 'Residential-homes', image: 'assets/categories/residential.jpg' },
    { name: 'Apartments', slug: 'Apartments', image: 'assets/categories/apartments.jpg' },
    { name: 'Gated Estates', slug: 'Gated-estates', image: 'assets/categories/estates.jpg' },
    { name: 'Office Blocks', slug: 'Office-blocks', image: 'assets/categories/offices.jpg' },
    { name: 'Shopping Malls', slug: 'Shopping-malls', image: 'assets/categories/malls.jpg' },
    { name: 'Hotels', slug: 'Hotels', image: 'assets/categories/hotels.jpg' },
    { name: 'Hospitals', slug: 'Hospitals', image: 'assets/categories/hospitals.jpg' },
    { name: 'Churches', slug: 'Churches', image: 'assets/categories/churches.jpg' },
    { name: 'Filling Stations', slug: 'Filling-stations', image: 'assets/categories/stations.jpg' },
    { name: 'Schools', slug: 'Schools', image: 'assets/categories/schools.jpg' },
    { name: 'Universities', slug: 'Universities', image: 'assets/categories/universities.jpg' },
    { name: 'Golf Clubs', slug: 'Golf-clubs', image: 'assets/categories/golf.jpg' },
    { name: 'Factories', slug: 'Factories', image: 'assets/categories/factories.jpg' },
    { name: 'Warehouses', slug: 'Warehouses', image: 'assets/categories/warehouses.jpg' },
    { name: 'Smart Cities', slug: 'Smart-cities', image: 'assets/categories/cities.jpg' },
    { name: 'Bible Colleges & Prayer Centers', slug: 'Bible-colleges-and-prayer-centers', image: 'assets/categories/bible.jpg' },
    { name: 'Airports', slug: 'Airports', image: 'assets/categories/Airports.jpg' }
  ];

  // This is what is used by <app-project-item-card>
  projects: any[] = [];

  constructor(private route: ActivatedRoute, private router: Router, private projectsService: ProjectsService) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.categorySlug = params.get('category')!;
      this.selectedCategory = this.categories.find(c => c.slug === this.categorySlug) || null;

      this.stopPolling();
      this.loadProjectsForCategory();
      this.startPolling();
    });
  }

  ngOnDestroy(): void {
    this.stopPolling();
  }

  loadProjectsForCategory() {
    this.projectsService.getProjectsByCategory(this.categorySlug).subscribe(
      (projects: any[]) => {
        this.projects = projects;
        console.log('Loaded projects for category', this.categorySlug, ':', projects);
      },
      (error) => {
        console.error('Error loading projects:', error);
        this.projects = [];
      }
    );
  }

  startPolling() {
    // Poll every 30 seconds to check for new projects
    this.pollingInterval = setInterval(() => {
      this.loadProjectsForCategory();
    }, 30000);
  }

  stopPolling() {
    if (this.pollingInterval) {
      clearInterval(this.pollingInterval);
      this.pollingInterval = null;
    }
  }

  // Called by "View More" button in the project card
  openProjectDetails(projectId: number) {
    this.router.navigate(['/projects', this.categorySlug, projectId]);
  }
}
