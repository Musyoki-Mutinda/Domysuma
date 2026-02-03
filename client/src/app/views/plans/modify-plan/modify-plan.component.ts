import { Component, OnInit } from '@angular/core';
import { Gallery, GalleryRef } from 'ng-gallery';

@Component({
  selector: 'app-modify-plan',
  templateUrl: './modify-plan.component.html',
  styleUrls: ['./modify-plan.component.scss'],
})
export class ModifyPlanComponent implements OnInit {
  galleryId = 'modifyPlanGallery';
  plansGalleryId = 'modifyPlansPlanGallery';

  images = [
    'https://images.unsplash.com/photo-1451976426598-a7593bd6d0b2?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80',
    'https://admin.domysumacontractors.com/uploads/small_Modern_3_Bedroom_Bungalow_2_8ea083df7a.png',
    'https://images.unsplash.com/photo-1448890372448-691670059ce8?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80',
    'https://images.unsplash.com/photo-1522190136917-1322500b0485?ixlib=rb-1.2.1&ixid=MnwxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8&auto=format&fit=crop&w=2670&q=80',
  ];

  constructor(private gallery: Gallery) {}

  ngOnInit(): void {
    const galleryRef: GalleryRef = this.gallery.ref(this.galleryId);
    const plansGalleryRef: GalleryRef = this.gallery.ref(this.plansGalleryId);

    galleryRef.addImage({
      src: this.images[0],
      thumb: this.images[0],
    });
    galleryRef.addImage({
      src: this.images[1],
      thumb: this.images[1],
    });

    galleryRef.addYoutube({
      src: 'oKY-ojtIK6c',
    });

    galleryRef.addImage({
      src: this.images[2],
      thumb: this.images[2],
    });
    galleryRef.addImage({
      src: this.images[3],
      thumb: this.images[3],
    });

    plansGalleryRef.addImage({
      src: '/assets/images/plans/floor-house-plan.jpeg',
      thumb: '/assets/images/plans/floor-house-plan.jpeg',
    });
    plansGalleryRef.addImage({
      src: '/assets/images/plans/What-is-a-floor-plan-with-dimensions.png',
      thumb: '/assets/images/plans/What-is-a-floor-plan-with-dimensions.png',
    });
  }
}
