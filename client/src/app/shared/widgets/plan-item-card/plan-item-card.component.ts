import { Component, OnInit } from '@angular/core';
import { IPlanData } from '../../../core/interfaces/i-plan-data';

@Component({
  selector: 'app-plan-item-card',
  templateUrl: './plan-item-card.component.html',
  styleUrls: ['./plan-item-card.component.scss']
})
export class PlanItemCardComponent implements OnInit {

  planData: IPlanData = {
    img: 'assets/images/4bd.png',
    id: 544343,
    title: '4 Bedroom Bungalow',
    bedrooms: 4,
    bathrooms: 4,
    storeys: 1,
    width: 200,
    length: 130,
    area: 30000,
    description: `This spacious four-bedroom bungalow design features 
    modern finishes, an open-plan living area, and functional room layouts 
    ideal for families looking for comfort and practicality.` 
  };

  isSaved = false;

  constructor() {}

  ngOnInit(): void {}

  toggleSave(target: EventTarget | null) {
  if (target instanceof HTMLElement) {
    this.isSaved = !this.isSaved;

    target.classList.add('clicked');
    setTimeout(() => target.classList.remove('clicked'), 300);
  }
}
}
