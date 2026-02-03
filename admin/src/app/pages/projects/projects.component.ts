import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-projects',
  styleUrls: ['./projects.component.scss'],
  template: `
    <router-outlet></router-outlet>
  `,
})
export class ProjectsComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }

}
