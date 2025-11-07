import { Component } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-project-categories',
  templateUrl: './project-categories.component.html',
  styleUrls: ['./project-categories.component.scss']
})
export class ProjectCategoriesComponent {

  constructor(private router: Router) {}

  categories = [
  { name: 'Residential Homes', slug: 'residential-homes', image: 'assets/categories/Residential_Homes_Decoy.jpg' },
  { name: 'Apartments', slug: 'apartments', image: 'assets/categories/Apartments_Decoy.jpg' },
  { name: 'Gated Estates', slug: 'gated-estates', image: 'assets/categories/Gated_Estates.jpg' },
  { name: 'Office Blocks', slug: 'office-blocks', image: 'assets/categories/Office_Blocks.jpg' },
  { name: 'Shopping Malls', slug: 'shopping-malls', image: 'assets/categories/Malls_Decoy.jpg' },
  { name: 'Hotels', slug: 'hotels', image: 'assets/categories/Hotels_Decoy.jpg' },
  { name: 'Hospitals', slug: 'hospitals', image: 'assets/categories/Hospitals_Decoy.jpg' },
  { name: 'Churches', slug: 'churches', image: 'assets/categories/Churches_Decoy.jpg' },
  { name: 'Filling Stations', slug: 'filling-stations', image: 'assets/categories/Filling_Stations.jpg' },
  { name: 'Schools', slug: 'schools', image: 'assets/categories/Schools_Decoy.jpg' },
  { name: 'Universities', slug: 'universities', image: 'assets/categories/Universities_Decoy.jpg' },
  { name: 'Golf Clubs', slug: 'golf-clubs', image: 'assets/categories/Golf_Clubs.jpg' },
  { name: 'Factories', slug: 'factories', image: 'assets/categories/Factories.jpg' },
  { name: 'Warehouses', slug: 'warehouses', image: 'assets/categories/Warehouse.jpg' },
  { name: 'Smart Cities', slug: 'smart-cities', image: 'assets/categories/Smart_Cities.jpg' },
  { name: 'Bible Colleges & Prayer Centers', slug: 'bible-colleges-and-prayer-centers', image: 'assets/categories/Prayer_Camp.jpg' },
];


  openCategory(slug: string) {
    this.router.navigate(['/projects', slug]);
  }
}
