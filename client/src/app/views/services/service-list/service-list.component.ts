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
    'We create functional, aesthetic and fully compliant architectural designs tailored to your vision and project needs.',
  route: '/services/1'
},
{
  icon: 'fa-building-columns',
  title: 'Structural Design',
  description:
    'We develop safe, efficient structural systems to ensure stability, durability and cost-effective construction.'
},
{
  icon: 'fa-briefcase',
  title: 'Project Management',
  description:
    'We oversee planning, budgeting, coordination and site operations to ensure your project is delivered on time and to standard.'
},
{
  icon: 'fa-calculator',
  title: 'Project Costing',
  description:
    'We provide accurate cost estimates, bills of quantities and budgeting guidance for smooth financial planning.'
},
{
  icon: 'fa-couch',
  title: 'Interior Design',
  description:
    'We design beautiful, functional interior spaces with cohesive aesthetics, materials, lighting and furniture layouts.'
},
{
  icon: 'fa-trowel-bricks',
  title: 'Construction',
  description:
    'We offer end-to-end construction solutions including site works, supervision and execution to bring your project to life.'
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
