import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';
import { SavedProjectsService } from '../../../core/services/saved-projects.service';
import { UserService } from '../../../core/services/user.service';
import { LoginModalService } from '../../../core/services/login-modal.service';

@Component({
  selector: 'app-project-item-card',
  templateUrl: './project-item-card.component.html',
  styleUrls: ['./project-item-card.component.scss']
})
export class ProjectItemCardComponent implements OnInit {

  @Input() projectData: any = {
    id: null,
    category: '',
    img: 'assets/images/residential.jpg',
    title: '4 Bedroom Bungalow',
    desc: 'Short description of the project...',
  };

  @Output() unsave = new EventEmitter<number>();

  isSaved = false;
  isLoggedIn = false;

  constructor(
    private router: Router,
    private savedProjectsService: SavedProjectsService,
    private userService: UserService,
    private loginModalService: LoginModalService
  ) {}

  ngOnInit(): void {
    console.log('Project card data:', this.projectData); // DEBUG

    // Check if user is logged in
    this.userService.userName$.subscribe(name => {
      this.isLoggedIn = !!name;
      if (this.isLoggedIn && this.projectData.id) {
        this.checkIfSaved();
      }
    });

    // ✅ Map description/longDescription to desc if desc is missing
    if (!this.projectData.desc) {
      const description = this.projectData.description || this.projectData.longDescription || this.projectData.long_description || '';
      if (description) {
        this.projectData.desc = description.length > 100 ? description.substring(0, 100) + '...' : description;
      } else {
        this.projectData.desc = this.projectData.title || 'No description available';
      }
    }

    // ✅ Map thumbnail/gallery images to img if img is missing
    if (!this.projectData.img || this.projectData.img.trim() === '') {
      // Try to get first gallery image
      const galleryImages = this.projectData.galleryImages ||
                           this.projectData.gallery_images ||
                           this.projectData.media || [];

      if (galleryImages && galleryImages.length > 0) {
        const firstImage = galleryImages[0];
        this.projectData.img = firstImage.url ||
                              firstImage.path ||
                              firstImage.mediaUrl ||
                              firstImage.media_url ||
                              'assets/images/residential.jpg';
      } else {
        this.projectData.img = 'assets/images/residential.jpg';
      }
    }
  }

  viewMore() {
    console.log('View More clicked:', this.projectData);
    if (!this.projectData?.id) {
      console.warn('projectData.id is missing in project-item-card.');
      return;
    }

    const categorySlug = this.projectData.categorySlug || this.projectData.category;
    if (!categorySlug) {
      console.warn('projectData.categorySlug or projectData.category is missing in project-item-card.');
      return;
    }

    this.router.navigate(['/projects', categorySlug, this.projectData.id]);
  }

  checkIfSaved(): void {
    if (this.projectData.id) {
      this.savedProjectsService.isProjectSaved(this.projectData.id).subscribe({
        next: (response) => {
          this.isSaved = response.isSaved;
        },
        error: (err) => {
          console.error('Error checking if project is saved:', err);
        }
      });
    }
  }

  toggleSave(event: Event): void {
    event.stopPropagation(); // Prevent triggering viewMore

    if (!this.isLoggedIn) {
      this.loginModalService.open();
      return;
    }

    if (this.isSaved) {
      this.savedProjectsService.unsaveProject(this.projectData.id).subscribe({
        next: () => {
          this.isSaved = false;
          this.unsave.emit(this.projectData.id);
        },
        error: (err) => {
          console.error('Error unsaving project:', err);
        }
      });
    } else {
      this.savedProjectsService.saveProject(this.projectData.id).subscribe({
        next: () => {
          this.isSaved = true;
        },
        error: (err) => {
          console.error('Error saving project:', err);
        }
      });
    }
  }
}