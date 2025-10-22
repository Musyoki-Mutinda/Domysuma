import {Component, OnInit} from '@angular/core';

@Component({
  selector: 'app-design-ideas',
  styleUrls: ['./design-ideas.component.scss'],
  template: `
    <router-outlet></router-outlet>
  `,
})
export class DesignIdeasComponent implements OnInit {

  constructor() {
  }

  ngOnInit(): void {
  }

}
