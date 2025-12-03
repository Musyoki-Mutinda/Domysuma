import { Component, OnInit } from '@angular/core';
import { Gallery, GalleryRef } from 'ng-gallery';
import { AuthService } from '../../../auth/auth.service';
import { LoginModalService } from '../../../core/services/login-modal.service';
import { SavedPlansService } from '../../../core/services/saved-plans.service';


@Component({
  selector: 'app-plan-details',
  templateUrl: './plan-details.component.html',
  styleUrls: ['./plan-details.component.scss'],
})
export class PlanDetailsComponent implements OnInit {

  galleryId = 'designs';
  plansGalleryId = 'plansGallery';

  project: any = null;
  similarProjects: any[] = [];
  selectedPlan: any = null;

  similarPlans: any[] = [
    { id: 1, title: 'Modern 3 Bedroom Bungalow', thumbnail: '/assets/images/plans/plan-1.jpeg', bedrooms: 3, bathrooms: 2, size: '145 sqm' },
    { id: 2, title: 'Modern 3 Bedroom Bungalow', thumbnail: '/assets/images/plans/plan-2.jpeg', bedrooms: 4, bathrooms: 3, size: '220 sqm' },
    { id: 3, title: 'Modern 3 Bedroom Bungalow', thumbnail: '/assets/images/plans/plan-3.jpeg', bedrooms: 2, bathrooms: 1, size: '90 sqm' }
  ];

  images = [
    'https://images.unsplash.com/photo-1451976426598-a7593bd6d0b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=2670&q=80',
    'https://admin.domysumacontractors.com/uploads/small_Modern_3_Bedroom_Bungalow_2_8ea083df7a.png',
    'https://images.unsplash.com/photo-1448890372448-691670059ce8?ixlib=rb-1.2.1&auto=format&fit=crop&w=2670&q=80',
    'https://images.unsplash.com/photo-1522190136917-1322500b0485?ixlib=rb-1.2.1&auto=format&fit=crop&w=2670&q=80',
  ];

  constructor(
    private gallery: Gallery,
    private auth: AuthService,
    private loginModalService: LoginModalService,
    private savedPlansService: SavedPlansService
  ) {}

  ngOnInit(): void {
    // Populate project details
    this.project = {
      id: 2390,
      title: 'Modern 3 Bedroom Bungalow',
      description: `
        Experience contemporary indoor-outdoor living with this stunning 3-bedroom bungalow.
        Features include a spacious family room, study area, open-plan kitchen, and high-end finishes throughout.
        Perfect for a growing family seeking comfort and style. For more information, kindly click our "Talk to Architects Free" button.
      `,
      location: 'Nairobi, Kenya',
      category: 'Residential',
      year: 2025,
      clientType: 'Private',
      scope: [
        'Architectural Design',
        'Structural Design',
        'Interior Design',
        'Landscape Design',
      ]
    };

    // Slideshow gallery
    const galleryRef: GalleryRef = this.gallery.ref(this.galleryId);
    this.images.forEach(img => galleryRef.addImage({ src: img, thumb: img }));
    galleryRef.addYoutube({ src: 'oKY-ojtIK6c' });

    // Floor-plan gallery
    const plansGalleryRef: GalleryRef = this.gallery.ref(this.plansGalleryId);
    plansGalleryRef.addImage({ src: '/assets/images/plans/floor-house-plan.jpeg', thumb: '/assets/images/plans/floor-house-plan.jpeg' });
    plansGalleryRef.addImage({ src: '/assets/images/plans/What-is-a-floor-plan-with-dimensions.png', thumb: '/assets/images/plans/What-is-a-floor-plan-with-dimensions.png' });
  }

  /** Triggered when heart icon is clicked */
  onHeartClick(): void {
    if (!this.auth.getToken()) {  // Use getToken() instead of private hasToken()
      this.openLoginModal();
    } else {
      this.savePlan();
    }
  }

  /** Open the login modal via service */
  openLoginModal(): void {
    this.loginModalService.open(); // Triggers LoginModalComponent
  }

  /** Save plan action */
  savePlan(): void {
  this.savedPlansService.addPlan(this.project);
  console.log('Plan saved for user:', this.project?.id);
}
}
