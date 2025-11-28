import { Injectable } from '@angular/core';

export interface Project {
  id: string;
  category: string;
  title: string;
  img: string;           // Thumbnail image for cards
  desc: string;          // Short description for cards
  gallery: string[];
  summary: string;
  description: string;
  specs: {
    duration: string;
    location: string;
    cost: string;
  };
}

@Injectable({ providedIn: 'root' })
export class ProjectsService {
  private projects: Project[] = [
    {
      id: '1',
      category: 'libraries',
      title: 'McMillan Library Revamp',
      img: 'assets/images/mcmillan-thumb.jpg',
      desc: 'A heritage restoration project in the heart of Nairobi.',
      gallery: ['img1.jpg', 'img2.jpg'],
      summary: 'A heritage restoration project in the heart of Nairobi.',
      specs: {
        duration: '6 months',
        location: 'Nairobi',
        cost: 'KSh 1.2M'
      },
      description: 'This project involved restoring the historic McMillan Library, including structural reinforcements and interior refurbishment.',
    },
    {
      id: '2',
      category: 'libraries',
      title: 'City Central Library Upgrade',
      img: 'assets/categories/Residential_Homes_Decoy.jpg',
      desc: 'Upgrading facilities for modern use.',
      gallery: ['img3.jpg', 'img4.jpg'],
      summary: 'Upgrading facilities for modern use.',
      specs: {
        duration: '8 months',
        location: 'Nairobi',
        cost: 'KSh 2.5M'
      },
      description: 'The City Central Library upgrade improved accessibility, added study rooms, and modernized tech infrastructure.',
    },
    {
      id: '3',
      category: 'schools',
      title: 'Sunrise Academy New Block',
      img: 'assets/categories/Residential_Homes_Decoy.jpg',
      desc: 'Constructed a new classroom block.',
      gallery: ['Residential_Homes_Decoy.jpg', 'Residential_Homes_Decoy.jpg'],
      summary: 'Constructed a new classroom block.',
      specs: {
        duration: '4 months',
        location: 'Nairobi',
        cost: 'KSh 800K'
      },
      description: 'Added a two-story classroom block to Sunrise Academy to accommodate increasing student numbers.',
    }
  ];

  getProjectById(id: string): Project | undefined {
    return this.projects.find(p => p.id === id);
  }

  getAllProjects(): Project[] {
    return this.projects;
  }

  getProjectsByCategory(category: string): Project[] {
    return this.projects.filter(p => p.category === category);
  }
}
