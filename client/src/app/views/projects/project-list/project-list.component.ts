import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-project-list',
  templateUrl: './project-list.component.html',
  styleUrls: ['./project-list.component.scss']
})
export class ProjectListComponent implements OnInit {

  categorySlug!: string;
  selectedCategory: any = null;

  categories = [
    { name: 'Residential Homes', slug: 'residential-homes', image: 'assets/categories/residential.jpg' },
    { name: 'Apartments', slug: 'apartments', image: 'assets/categories/apartments.jpg' },
    { name: 'Gated Estates', slug: 'gated-estates', image: 'assets/categories/estates.jpg' },
    { name: 'Office Blocks', slug: 'office-blocks', image: 'assets/categories/offices.jpg' },
    { name: 'Shopping Malls', slug: 'shopping-malls', image: 'assets/categories/malls.jpg' },
    { name: 'Hotels', slug: 'hotels', image: 'assets/categories/hotels.jpg' },
    { name: 'Hospitals', slug: 'hospitals', image: 'assets/categories/hospitals.jpg' },
    { name: 'Churches', slug: 'churches', image: 'assets/categories/churches.jpg' },
    { name: 'Filling Stations', slug: 'filling-stations', image: 'assets/categories/stations.jpg' },
    { name: 'Schools', slug: 'schools', image: 'assets/categories/schools.jpg' },
    { name: 'Universities', slug: 'universities', image: 'assets/categories/universities.jpg' },
    { name: 'Golf Clubs', slug: 'golf-clubs', image: 'assets/categories/golf.jpg' },
    { name: 'Factories', slug: 'factories', image: 'assets/categories/factories.jpg' },
    { name: 'Warehouses', slug: 'warehouses', image: 'assets/categories/warehouses.jpg' },
    { name: 'Smart Cities', slug: 'smart-cities', image: 'assets/categories/cities.jpg' },
    { name: 'Bible Colleges & Prayer Centers', slug: 'bible-colleges-and-prayer-centers', image: 'assets/categories/bible.jpg' },
    { name: 'Airports', slug: 'airports', image: 'assets/categories/Airports.jpg' },
  ];

  // This is what is used by <app-project-item-card>
  projects: any[] = [];

  constructor(private route: ActivatedRoute, private router: Router) {}

  ngOnInit(): void {
    this.route.paramMap.subscribe(params => {
      this.categorySlug = params.get('category')!;
      this.selectedCategory = this.categories.find(c => c.slug === this.categorySlug) || null;

      this.loadProjectsForCategory();
    });
  }

  loadProjectsForCategory() {
    // Generate dummy data that matches your project-item-card
    this.projects = [
      {
        id: 1,
        img: this.selectedCategory.image,
        title: `${this.selectedCategory.name} Project 1`,
        desc: 'A sample project description showcasing architectural excellence.'
      },
      {
        id: 2,
        img: this.selectedCategory.image,
        title: `${this.selectedCategory.name} Project 2`,
        desc: 'A sample project description showcasing architectural excellence.'
      },
      {
        id: 3,
        img: this.selectedCategory.image,
        title: `${this.selectedCategory.name} Project 3`,
        desc: 'A sample project description showcasing architectural excellence.'
      }
    ];
  }

  // Called by "View More" button in the project card
  openProjectDetails(projectId: number) {
    this.router.navigate(['/projects', this.categorySlug, projectId]);
  }
}
