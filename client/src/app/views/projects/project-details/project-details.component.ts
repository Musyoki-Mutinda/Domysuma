import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss']
})
export class ProjectDetailsComponent implements OnInit {

  categorySlug: string | null = null;
  projectId: string | null = null;

  galleryId: string | null = null;
  plansGalleryId: string | null = null;

  // 🟢 Temporary dummy data (Replace with Directus later)
  project = {
    title: 'Luxury Residential Villa',
    location: 'Karen, Nairobi',
    year: 2023,
    status: 'Completed',
    description: `This luxury residential villa features contemporary design, 
    open spaces and seamless integration between indoor and outdoor environments.`,
    heroImage: 'assets/projects/sample-hero.jpg',
    galleryImages: [
      'assets/projects/sample1.jpg',
      'assets/projects/sample2.jpg',
      'assets/projects/sample3.jpg'
    ],
    floorPlanImages: [
      'assets/projects/plan1.jpg',
      'assets/projects/plan2.jpg'
    ]
  };

  constructor(private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.categorySlug = this.route.snapshot.paramMap.get('category');
    this.projectId = this.route.snapshot.paramMap.get('id');

    this.galleryId = `project-${this.projectId}-main`;
    this.plansGalleryId = `project-${this.projectId}-plans`;
  }

}
