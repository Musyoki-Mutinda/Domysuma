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
    img: 'assets/images/prj.png',
    title: '4 Bedroom Bungalow',
    desc: 'A 6 Storey Apartment Block consisting of 1&2 Bedroom units.' +
      'The Apartment sits on a 50x100 plot with the ground floor consisting ' +
      'of parking area of up to 50 vehicles . . .',
  };

  constructor(private router: Router) { }

  ngOnInit(): void { }

  viewMore() {
    if (!this.projectData?.category || !this.projectData?.id) {
      console.warn('projectData.category or projectData.id is missing in project-item-card.');
      return;
    }
    this.router.navigate(['/projects', this.projectData.category, this.projectData.id]);
  }

}
