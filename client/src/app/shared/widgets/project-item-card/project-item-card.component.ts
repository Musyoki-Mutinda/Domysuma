import { Component, OnInit } from '@angular/core';
import {IPlanData} from "../../../core/interfaces/i-plan-data";

@Component({
  selector: 'app-project-item-card',
  templateUrl: './project-item-card.component.html',
  styleUrls: ['./project-item-card.component.scss']
})
export class ProjectItemCardComponent implements OnInit {
  projectData: any = {
    img: 'assets/images/prj.png',
    title: '4 Bedroom Bungalow',
    desc: 'A 6 Storey Apartment Block consisting of 1&2 Bedroom units.' +
      'The Apartment sits on a 50x100 plot with the ground floor consisting ' +
      'of parking area of up to 50 vehicles . . .',
  }
  constructor() { }

  ngOnInit(): void {
  }

}
