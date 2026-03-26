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
    img: 'assets/images/prj.png',
    title: 'Untitled Project',
    desc: 'Short description of the project...',
  };

  @Output() unsave = new EventEmitter<number>();

  isSaved = false;
  isLoggedIn = false;

  readonly FALLBACK_IMG = 'assets/images/prj.png';

  constructor(
    private router: Router,
    private savedProjectsService: SavedProjectsService,
    private userService: UserService,
    private loginModalService: LoginModalService
  ) {}

  ngOnInit(): void {
    this.userService.userName$.subscribe(name => {
      this.isLoggedIn = !!name;
      if (this.isLoggedIn && this.projectData.id) {
        this.checkIfSaved();
      }
    });

    // Safety net: if img is missing after service mapping, try gallery array
    if (!this.projectData.img || this.projectData.img === this.FALLBACK_IMG) {
      const firstGalleryImage = this.projectData.gallery?.[0] || null;
      if (firstGalleryImage) {
        this.projectData.img = firstGalleryImage;
      }
    }

    // Safety net: ensure desc is always populated
    if (!this.projectData.desc) {
      const description =
        this.projectData.description ||
        this.projectData.longDescription ||
        this.projectData.long_description || '';
      this.projectData.desc = description
        ? description.length > 100 ? description.substring(0, 100) + '...' : description
        : this.projectData.title || 'No description available';
    }
  }

  onImageError(): void {
    this.projectData.img = this.FALLBACK_IMG;
  }

  viewMore(): void {
    console.log('=== Project Item Card - View More clicked ===');
    console.log('Project Data:', this.projectData);
    
    if (!this.projectData?.id) {
      console.warn('projectData.id is missing in project-item-card.');
      return;
    }
    
    let categorySlug = this.projectData.categorySlug;
    
    if (!categorySlug) {
      console.log('categorySlug not provided, generating from category:', this.projectData.category);
      // Create a slug from category if categorySlug is not provided
      categorySlug = this.projectData.category?.toLowerCase().replace(/\s+/g, '-') || 'other';
    }
    
    // Ensure we're passing a numeric ID (since some services might convert to string)
    const numericId = parseInt(this.projectData.id, 10);
    if (isNaN(numericId)) {
      console.warn('Invalid project ID:', this.projectData.id);
      return;
    }
    
    const navigateUrl = `/projects/${categorySlug}/${numericId}`;
    console.log('Navigating to URL:', navigateUrl);
    
    try {
      this.router.navigateByUrl(navigateUrl).then(success => {
        if (success) {
          console.log('Navigation successful');
        } else {
          console.error('Navigation failed');
        }
      }).catch(error => {
        console.error('Navigation error:', error);
      });
    } catch (error) {
      console.error('Navigation exception:', error);
    }
  }

  checkIfSaved(): void {
    if (this.projectData.id) {
      this.savedProjectsService.isProjectSaved(this.projectData.id).subscribe({
        next: (response) => { this.isSaved = response.isSaved; },
        error: (err) => { console.error('Error checking if project is saved:', err); }
      });
    }
  }

  toggleSave(event: Event): void {
    event.stopPropagation();

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
        error: (err) => { console.error('Error unsaving project:', err); }
      });
    } else {
      this.savedProjectsService.saveProject(this.projectData.id).subscribe({
        next: () => { this.isSaved = true; },
        error: (err) => { console.error('Error saving project:', err); }
      });
    }
  }
}