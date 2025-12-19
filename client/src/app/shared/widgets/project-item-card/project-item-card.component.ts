import { Component, Input, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-project-item-card',
  templateUrl: './project-item-card.component.html',
  styleUrls: ['./project-item-card.component.scss']
})
export class ProjectItemCardComponent implements OnInit {

  @Input() projectData: any = {
    id: null,
    category: '',
    img: 'assets/images/residential.jpg',
    title: '4 Bedroom Bungalow',
    desc: 'Short description of the project...',
  };

  constructor(private router: Router) {}

  ngOnInit(): void {
    // ✅ Enforce fallback for missing images
    if (!this.projectData?.img || this.projectData.img.trim() === '') {
      this.projectData.img = 'assets/images/residential.jpg';
    }
  }

  viewMore() {
    if (!this.projectData?.category || !this.projectData?.id) {
      console.warn('projectData.category or projectData.id is missing in project-item-card.');
      return;
    }

    this.router.navigate(['/projects', this.projectData.category, this.projectData.id]);
  }
}
