import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProjectService } from '../project.service';

@Component({
  selector: 'app-design-create',
  templateUrl: './create.component.html',
})
export class CreateComponent implements OnInit {

  projectForm!: FormGroup;
  categories = [
    { name: 'Residential Homes', slug: 'residential-homes' },
    { name: 'Apartments', slug: 'apartments' },
    { name: 'Controlled Development Estate', slug: 'gated-estates' },
    { name: 'Office Blocks', slug: 'office-blocks' },
    { name: 'Shopping Malls', slug: 'shopping-malls' },
    { name: 'Hotels', slug: 'hotels' },
    { name: 'Hospitals', slug: 'hospitals' },
    { name: 'Churches', slug: 'churches' },
    { name: 'Filling Stations', slug: 'filling-stations' },
    { name: 'Sports Complex & Stadiums', slug: 'stadiums' },
    { name: 'Learning Institutions', slug: 'universities' },
    { name: 'Golf Clubs', slug: 'golf-clubs' },
    { name: 'Factories', slug: 'factories' },
    { name: 'Warehouses', slug: 'warehouses' },
    { name: 'Smart Cities', slug: 'smart-cities' },
    { name: 'Bible Colleges & Prayer Centers', slug: 'bible-colleges-and-prayer-centers' },
  ];
  isSubmitting = false;
  submitError: string | null = null;
  isEditing = false;
  editingProjectId: number | null = null;

  // Store selected files
  galleryImages: File[] = [];
  architecturalDrawings: File[] = [];

  // Store existing media
  existingGalleryImages: any[] = [];
  existingArchitecturalDrawings: any[] = [];

  constructor(private fb: FormBuilder, private projectService: ProjectService, private router: Router, private route: ActivatedRoute) {}

  ngOnInit(): void {
    this.projectForm = this.fb.group({
      projectTitle: ['', Validators.required],
      category: ['', Validators.required],
      briefDescription: ['', Validators.required],
      location: ['', Validators.required],
      yearCompleted: [''],
      clientType: [''],
      scope: [''],
      // Keep additional fields for future use
      countyTown: [''],
      floorArea: [''],
      structuralSystem: [''],
      interiorFeatures: [''],
      additionalNotes: [''],
      architectName: [''],
    });

    // Check if editing by route parameter
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditing = true;
      this.editingProjectId = +id;
      this.loadProjectForEditing(+id);
    }
  }

  private loadProjectForEditing(id: number): void {
    this.projectService.getProjectById(id).subscribe(
      (project: any) => {
        console.log('Loaded project for editing:', project);
        this.populateForm(project);
        this.existingGalleryImages = project.galleryImages || [];
        this.existingArchitecturalDrawings = project.architecturalDrawings || [];
      },
      (error) => {
        console.error('Error loading project for editing:', error);
        alert('Failed to load project for editing.');
      }
    );
  }

  private populateForm(project: any): void {
    console.log('Populating form with project:', project);
    // Parse scope if it's a JSON string
    let scopeText = '';
    if (project.scope) {
      try {
        const scopeArray = typeof project.scope === 'string' ? JSON.parse(project.scope) : project.scope;
        scopeText = scopeArray.join('\n');
      } catch (e) {
        scopeText = project.scope;
      }
    }

    this.projectForm.patchValue({
      projectTitle: project.title || '',
      category: project.category || '',
      briefDescription: project.description || '',
      location: project.location || '',
      yearCompleted: project.year || '',
      clientType: project.clientType || '',
      scope: scopeText,
      countyTown: project.county || '',
      floorArea: project.totalFloorArea || '',
      structuralSystem: project.structuralSystem || '',
      interiorFeatures: project.interiorFeatures || '',
      additionalNotes: project.longDescription || '',
      architectName: project.designer || '',
    });
    console.log('Form populated');
  }

  // ----------- FILE HANDLERS ------------------

  onGallerySelected(event: any) {
    const files: FileList = event.target.files;
    this.galleryImages = Array.from(files);
    console.log('Gallery files:', this.galleryImages);
  }

  onDrawingsSelected(event: any) {
    const files: FileList = event.target.files;
    this.architecturalDrawings = Array.from(files);
    console.log('Architectural drawings:', this.architecturalDrawings);
  }

  // ----------- SUBMIT FORM ------------------

  submit() {
    if (!this.projectForm.valid) {
      this.submitError = 'Please fill in all required fields.';
      return;
    }

    this.isSubmitting = true;
    this.submitError = null;

    const scopeText = this.projectForm.get('scope')?.value || '';
    const scope = scopeText.split('\n').map((item: string) => item.trim()).filter((item: string) => item);

    if (this.isEditing && this.editingProjectId) {
      // Update existing project - first update text fields
      this.projectService.updateProject(this.editingProjectId, {
        title: this.projectForm.get('projectTitle')?.value,
        description: this.projectForm.get('briefDescription')?.value,
        location: this.projectForm.get('location')?.value,
        category: this.projectForm.get('category')?.value,
        year: this.projectForm.get('yearCompleted')?.value,
        clientType: this.projectForm.get('clientType')?.value,
        scope: JSON.stringify(scope),
        county: this.projectForm.get('countyTown')?.value,
        totalFloorArea: this.projectForm.get('floorArea')?.value,
        structuralSystem: this.projectForm.get('structuralSystem')?.value,
        interiorFeatures: this.projectForm.get('interiorFeatures')?.value,
        longDescription: this.projectForm.get('additionalNotes')?.value,
        designer: this.projectForm.get('architectName')?.value,
      }).subscribe(
        (res) => {
          console.log("Project text updated!", res);

          // Now add new media if any
          if (this.galleryImages.length > 0 || this.architecturalDrawings.length > 0) {
            this.addNewMediaToProject(this.editingProjectId!);
          } else {
            this.isSubmitting = false;
            alert('Project updated successfully!');
            this.router.navigate(['../list']);
          }
        },
        (err) => {
          console.error("Update error:", err);
          this.isSubmitting = false;
          this.submitError = err.error?.message || 'Error updating project. Please try again.';
        }
      );
    } else {
      // Create new project - use FormData
      const formData = new FormData();

      // Append text fields
      formData.append('title', this.projectForm.get('projectTitle')?.value || '');
      formData.append('description', this.projectForm.get('briefDescription')?.value || '');
      formData.append('location', this.projectForm.get('location')?.value || '');
      formData.append('category', this.projectForm.get('category')?.value || '');
      formData.append('yearCompleted', this.projectForm.get('yearCompleted')?.value || '');
      formData.append('client', this.projectForm.get('clientType')?.value || '');
      formData.append('county', this.projectForm.get('countyTown')?.value || '');
      formData.append('totalFloorArea', this.projectForm.get('floorArea')?.value || '');
      formData.append('structuralSystem', this.projectForm.get('structuralSystem')?.value || '');
      formData.append('interiorFeatures', this.projectForm.get('interiorFeatures')?.value || '');
      formData.append('longDescription', this.projectForm.get('additionalNotes')?.value || '');
      formData.append('designer', this.projectForm.get('architectName')?.value || '');

      // Store scope as JSON string (backend can parse it)
      formData.append('scope', JSON.stringify(scope));

      // Append gallery images
      this.galleryImages.forEach((file, index) => {
        formData.append('galleryImages', file, file.name);
      });

      // Append architectural drawings
      this.architecturalDrawings.forEach((file, index) => {
        formData.append('architecturalDrawings', file, file.name);
      });

      // Debug FormData contents
      console.log('FormData created with:');
      console.log('- Title:', this.projectForm.get('projectTitle')?.value);
      console.log('- Description:', this.projectForm.get('briefDescription')?.value);
      console.log('- Location:', this.projectForm.get('location')?.value);
      console.log('- Category:', this.projectForm.get('category')?.value);
      console.log('- Year:', this.projectForm.get('yearCompleted')?.value);
      console.log('- Client Type:', this.projectForm.get('clientType')?.value);
      console.log('- Scope items:', scope.length);
      console.log('- Gallery images:', this.galleryImages.length);
      console.log('- Architectural drawings:', this.architecturalDrawings.length);

      this.projectService.createProject(formData).subscribe(
        (res) => {
          console.log("Created!", res);
          this.isSubmitting = false;
          alert('Project created successfully!');
          this.projectForm.reset();
          this.galleryImages = [];
          this.architecturalDrawings = [];
        },
        (err) => {
          console.error("Create error:", err);
          this.isSubmitting = false;
          this.submitError = err.error?.message || 'Error creating project. Please try again.';
        }
      );
    }
  }

  private async addNewMediaToProject(projectId: number) {
    const mediaCreates: any[] = [];

    // Process gallery images
    for (const file of this.galleryImages) {
      try {
        const base64 = await this.fileToBase64(file);
        mediaCreates.push({
          encodedFile: base64,
          mediaType: 'IMAGE',
          mediaGroup: 'IMAGES',
          title: file.name,
          alt: file.name,
          isDefault: mediaCreates.length === 0 // First image is default
        });
      } catch (e) {
        console.error('Error processing gallery image:', file.name, e);
      }
    }

    // Process architectural drawings
    for (const file of this.architecturalDrawings) {
      try {
        const base64 = await this.fileToBase64(file);
        mediaCreates.push({
          encodedFile: base64,
          mediaType: file.type.startsWith('image/') ? 'IMAGE' : 'DOCUMENT',
          mediaGroup: 'ARCHITECTURAL_DRAWINGS',
          title: file.name,
          alt: file.name,
          isDefault: false
        });
      } catch (e) {
        console.error('Error processing architectural drawing:', file.name, e);
      }
    }

    if (mediaCreates.length > 0) {
      this.projectService.addProjectMedia(projectId, mediaCreates).subscribe(
        (res) => {
          console.log("Media added!", res);
          this.isSubmitting = false;
          alert('Project updated successfully!');
          this.router.navigate(['../list']);
        },
        (err) => {
          console.error("Add media error:", err);
          this.isSubmitting = false;
          this.submitError = err.error?.message || 'Error adding media. Please try again.';
        }
      );
    } else {
      this.isSubmitting = false;
      alert('Project updated successfully!');
      this.router.navigate(['../list']);
    }
  }

  private fileToBase64(file: File): Promise<string> {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64 = reader.result as string;
        // Remove the data URL prefix (e.g., "data:image/jpeg;base64,")
        const base64Data = base64.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = error => reject(error);
    });
  }
}
