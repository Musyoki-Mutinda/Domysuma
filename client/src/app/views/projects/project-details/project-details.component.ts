import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Gallery, GalleryRef } from 'ng-gallery';
import { AuthService } from '../../../auth/auth.service';
import { LoginModalService } from '../../../core/services/login-modal.service';
import { SavedPlansService } from '../../../core/services/saved-plans.service';
import { SavedProjectsService } from '../../../core/services/saved-projects.service';
import { UserService } from '../../../core/services/user.service';
import { ProjectService } from '../../../core/services/project.service';

@Component({
  selector: 'app-project-details',
  templateUrl: './project-details.component.html',
  styleUrls: ['./project-details.component.scss'],
})
export class ProjectDetailsComponent implements OnInit {

  galleryId = 'designs';
  plansGalleryId = 'plansGallery';

  project: any = null;
  similarProjects: any[] = [];
  selectedPlan: any = null;

  similarPlans: any[] = [];

  // Category mapping for routing
  private categoryMap: { [key: string]: string } = {
    'Residential Homes': 'residential-homes',
    'Apartments': 'apartments',
    'Controlled Development Estate': 'gated-estates',
    'Office Blocks': 'office-blocks',
    'Shopping Malls': 'shopping-malls',
    'Hotels': 'hotels',
    'Hospitals': 'hospitals',
    'Churches': 'churches',
    'Filling Stations': 'filling-stations',
    'Sports Complex & Stadiums': 'stadiums',
    'Learning Institutions': 'universities',
    'Golf Clubs': 'golf-clubs',
    'Factories': 'factories',
    'Warehouses': 'warehouses',
    'Smart Cities': 'smart-cities',
    'Bible Colleges & Prayer Centers': 'bible-colleges-and-prayer-centers',
    'Residential': 'residential-homes', // fallback
    'Commercial': 'office-blocks' // fallback
  };

  images = [
    'https://images.unsplash.com/photo-1451976426598-a7593bd6d0b2?ixlib=rb-1.2.1&auto=format&fit=crop&w=2670&q=80',
    'https://images.unsplash.com/photo-1448890372448-691670059ce8?ixlib=rb-1.2.1&auto=format&fit=crop&w=2670&q=80',
    'https://images.unsplash.com/photo-1522190136917-1322500b0485?ixlib=rb-1.2.1&auto=format&fit=crop&w=2670&q=80',
  ];

  /** Share popup state */
  showSharePopup = false;

  isSaved = false;
  isLoggedIn = false;

  constructor(
    private route: ActivatedRoute,
    private gallery: Gallery,
    private auth: AuthService,
    private loginModalService: LoginModalService,
    private savedPlansService: SavedPlansService,
    private savedProjectsService: SavedProjectsService,
    private userService: UserService,
    private projectService: ProjectService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    console.log('=== PROJECT DETAILS - Loading ID:', id);

    // Check if user is logged in
    this.userService.userName$.subscribe(name => {
      this.isLoggedIn = !!name;
    });

    if (id) {
      this.projectService.getProjectById(+id).subscribe(
        (response: any) => {
          console.log('=== FULL API RESPONSE ===', response);

          const project = response.data || response;
          console.log('=== PROJECT DATA ===', project);
          console.log('=== Gallery Images ===', project.galleryImages || project.gallery_images);
          console.log('=== Architectural Drawings ===', project.architecturalDrawings || project.architectural_drawings);

          // Parse scope
          let scope = ['Architectural Design', 'Structural Design', 'Interior Design', 'Landscape Design'];
          if (project.scope) {
            try {
              scope = typeof project.scope === 'string' ? JSON.parse(project.scope) : project.scope;
            } catch (e) {
              scope = project.scope.split('\n').map((item: string) => item.trim()).filter((item: string) => item);
            }
          }

          this.project = {
            id: project.id,
            title: project.title,
            description: project.description || project.long_description || project.longDescription || '',
            location: project.location,
            category: project.category || 'Residential',
            year: project.year || project.yearCompleted,
            clientType: project.clientType || project.client_type || project.client || 'Private',
            scope: scope
          };

          // Check if project is saved
          if (this.isLoggedIn && this.project.id) {
            this.checkIfSaved();
          }

          // Load similar projects
          this.loadSimilarProjects();

          // Setup gallery images - FIXED VERSION
          const galleryRef: GalleryRef = this.gallery.ref(this.galleryId);
          const galleryImages = project.galleryImages || project.gallery_images || project.media || [];
          
          if (galleryImages && galleryImages.length > 0) {
            console.log('✅ Loading gallery images from database:', galleryImages);
            console.log('🔍 First image RAW object:', JSON.stringify(galleryImages[0]));
            
            galleryImages.forEach((media: any) => {
              // CRITICAL: Use 'path' first (backend returns this), then fallback to 'url'
              const imageUrl = media.path || media.url || media.mediaUrl || media.media_url;
              
              if (imageUrl) {
                console.log('✅ Adding gallery image:', imageUrl);
                galleryRef.addImage({ src: imageUrl, thumb: imageUrl });
              } else {
                console.error('❌ Image has no valid URL:', media);
              }
            });
          } else {
            console.warn('⚠️ No gallery images found, using defaults');
            this.images.forEach(img => galleryRef.addImage({ src: img, thumb: img }));
            galleryRef.addYoutube({ src: 'oKY-ojtIK6c' });
          }

          // Setup architectural drawings - FIXED VERSION
          const plansGalleryRef: GalleryRef = this.gallery.ref(this.plansGalleryId);
          const architecturalDrawings = project.architecturalDrawings || project.architectural_drawings || [];
          
          if (architecturalDrawings && architecturalDrawings.length > 0) {
            console.log('✅ Loading architectural drawings from database:', architecturalDrawings);
            console.log('🔍 First drawing RAW object:', JSON.stringify(architecturalDrawings[0]));
            
            architecturalDrawings.forEach((media: any) => {
              // CRITICAL: Use 'path' first (backend returns this), then fallback to 'url'
              const drawingUrl = media.path || media.url || media.mediaUrl || media.media_url;
              
              if (drawingUrl) {
                console.log('✅ Adding architectural drawing:', drawingUrl);
                plansGalleryRef.addImage({ src: drawingUrl, thumb: drawingUrl });
              } else {
                console.error('❌ Drawing has no valid URL:', media);
              }
            });
          } else {
            console.warn('⚠️ No architectural drawings found, using defaults');
            plansGalleryRef.addImage({ 
              src: '/assets/images/plans/floor-house-plan.jpeg', 
              thumb: '/assets/images/plans/floor-house-plan.jpeg' 
            });
            plansGalleryRef.addImage({ 
              src: '/assets/images/plans/What-is-a-floor-plan-with-dimensions.png', 
              thumb: '/assets/images/plans/What-is-a-floor-plan-with-dimensions.png' 
            });
          }
        },
        (error) => {
          console.error('❌ Error fetching project:', error);
          // Fallback to hardcoded data
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

          // Load similar projects (even for fallback data)
          this.loadSimilarProjects();

          // Default galleries
          const galleryRef: GalleryRef = this.gallery.ref(this.galleryId);
          this.images.forEach(img => galleryRef.addImage({ src: img, thumb: img }));
          galleryRef.addYoutube({ src: 'oKY-ojtIK6c' });

          const plansGalleryRef: GalleryRef = this.gallery.ref(this.plansGalleryId);
          plansGalleryRef.addImage({ src: '/assets/images/plans/floor-house-plan.jpeg', thumb: '/assets/images/plans/floor-house-plan.jpeg' });
          plansGalleryRef.addImage({ src: '/assets/images/plans/What-is-a-floor-plan-with-dimensions.png', thumb: '/assets/images/plans/What-is-a-floor-plan-with-dimensions.png' });
        }
      );
    }
  }

  /** Triggered when heart icon is clicked */
  onHeartClick(): void {
    if (!this.isLoggedIn) {
      this.openLoginModal();
    } else {
      this.toggleSave();
    }
  }

  checkIfSaved(): void {
    if (this.project.id) {
      this.savedProjectsService.isProjectSaved(this.project.id).subscribe({
        next: (response) => {
          this.isSaved = response.isSaved;
        },
        error: (err) => {
          console.error('Error checking if project is saved:', err);
        }
      });
    }
  }

  toggleSave(): void {
    if (this.isSaved) {
      this.savedProjectsService.unsaveProject(this.project.id).subscribe({
        next: () => {
          this.isSaved = false;
        },
        error: (err) => {
          console.error('Error unsaving project:', err);
        }
      });
    } else {
      this.savedProjectsService.saveProject(this.project.id).subscribe({
        next: () => {
          this.isSaved = true;
        },
        error: (err) => {
          console.error('Error saving project:', err);
        }
      });
    }
  }

  /** Open the login modal via service */
  openLoginModal(): void {
    this.loginModalService.open();
  }

  /** Save plan action */
  savePlan(): void {
    this.savedPlansService.addPlan(this.project);
    console.log('Plan saved for user:', this.project?.id);
  }

  /** Load similar projects from the same category */
   loadSimilarProjects(): void {
    if (!this.project?.category) return;

    this.projectService.getProjects().subscribe(
      (response: any) => {
        const allProjects = response.data || response || [];
        console.log('All projects for similar:', allProjects);

        // Filter by same category, exclude current project, limit to 3
         this.similarPlans = allProjects
          .filter((p: any) => {
            // Debug category comparison
            const sameCategory = p.category === this.project.category;
            const notCurrentProject = Number(p.id) !== Number(this.project.id);
            console.log(`Project ${p.id} (${p.title}): same category=${sameCategory}, not current=${notCurrentProject}`);
            return sameCategory && notCurrentProject;
          })
          .slice(0, 3)
          .map((p: any) => {
            // Set thumbnail to first gallery image if available
            let img = 'assets/images/prj.png';
            const galleryImages = p.galleryImages || p.gallery_images || p.media || [];
            if (galleryImages && galleryImages.length > 0) {
              const firstImage = galleryImages[0];
              img = typeof firstImage === 'string' ? firstImage : firstImage.path || firstImage.url || 'assets/images/prj.png';
            }

            const processedProject = {
              ...p,
              categorySlug: this.categoryMap[p.category] || p.category.toLowerCase().replace(/\s+/g, '-'),
              img: img
            };
            console.log('Processed similar project:', processedProject);
            return processedProject;
          });

        console.log('Similar projects loaded:', this.similarPlans);
      },
      (error) => {
        console.error('Error loading similar projects:', error);
        this.similarPlans = [];
      }
    );
  }

  /** Share popup methods */
  toggleSharePopup(): void {
    this.showSharePopup = !this.showSharePopup;
  }

  shareTo(platform: string): void {
    const url = encodeURIComponent(window.location.href);
    let shareUrl = '';

    switch(platform) {
      case 'whatsapp':
        shareUrl = `https://wa.me/?text=${url}`;
        break;
      case 'facebook':
        shareUrl = `https://www.facebook.com/sharer/sharer.php?u=${url}`;
        break;
      case 'twitter':
        shareUrl = `https://twitter.com/intent/tweet?url=${url}`;
        break;
      case 'linkedin':
        shareUrl = `https://www.linkedin.com/sharing/share-offsite/?url=${url}`;
        break;
    }

    window.open(shareUrl, '_blank');
  }

  copyLink(): void {
    navigator.clipboard.writeText(window.location.href).then(() => {
      alert('Link copied to clipboard!');
    });
  }

}