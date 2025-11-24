import { Component, HostListener } from '@angular/core';

@Component({
  selector: 'app-service-list',
  templateUrl: './service-list.component.html',
  styleUrls: ['./service-list.component.scss']
})
export class ServiceListComponent {

  scrollY = 0;

  services = [
    {
      icon: 'fa-compass-drafting',
      title: 'Architectural Design',
      description:
        'The philosophy of architecture is a branch of philosophy of art, dealing with aesthetic value of architecture',
      route: '/services/1'
    },
    {
      icon: 'fa-briefcase',
      title: 'Structural Design',
      description:
        'The philosophy of architecture is a branch of philosophy of art, dealing with aesthetic value of architecture'
    },
    {
      icon: 'fa-briefcase',
      title: 'Project Management',
      description:
        'The philosophy of architecture is a branch of philosophy of art, dealing with aesthetic value of architecture'
    },
    {
      icon: 'fa-briefcase',
      title: 'Structural Design',
      description:
        'The philosophy of architecture is a branch of philosophy of art, dealing with aesthetic value of architecture'
    },
    {
      icon: 'fa-briefcase',
      title: 'Architectural Design',
      description:
        'The philosophy of architecture is a branch of philosophy of art, dealing with aesthetic value of architecture'
    },
    {
      icon: 'fa-trowel-bricks',
      title: 'Construction',
      description:
        'The philosophy of architecture is a branch of philosophy of art, dealing with aesthetic value of architecture'
    }
  ];

  @HostListener('window:scroll')
  onScroll() {
    this.scrollY = window.scrollY;
  }

  getCardStyle(index: number) {
    const baseOffset = index * 140; // vertical spacing per card
    const progress = Math.max(0, this.scrollY - baseOffset);

    // movement
    const translateY = Math.min(progress * 0.12, 70);

    // slight shrink on scroll
    const scale = Math.max(1 - progress * 0.0006, 0.9);

    return {
      transform: `translateY(-${translateY}px) scale(${scale})`
    };
  }
}
