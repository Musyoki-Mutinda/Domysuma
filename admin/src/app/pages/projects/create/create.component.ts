import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProjectService } from '../project.service';
import imageCompression from 'browser-image-compression';

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

  // File size limits (in bytes)
  private readonly MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB per file
  private readonly MAX_TOTAL_SIZE = 40 * 1024 * 1024; // 40MB total request

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
      countyTown: [''],
      floorArea: [''],
      structuralSystem: [''],
      interiorFeatures: [''],
      additionalNotes: [''],
      architectName: [''],
    });

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

  // ----------- FILE HANDLERS WITH COMPRESSION ------------------

  async onGallerySelected(event: any) {
    const files: FileList = event.target.files;
    const validFiles: File[] = [];
    let totalSize = 0;
    const errors: string[] = [];

    // Compression options - maintains quality while reducing size
    const compressionOptions = {
      maxSizeMB: 0.8,          // Max 800KB per image
      maxWidthOrHeight: 2000,  // Max dimension 2000px (more than enough for web)
      useWebWorker: true,
      initialQuality: 0.85     // 85% quality - visually lossless
    };

    console.log('Processing', files.length, 'images...');

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // Check if it's an image
      if (!file.type.startsWith('image/')) {
        errors.push(`${file.name} is not a valid image file.`);
        continue;
      }

      try {
        // Compress the image
        const compressedFile = await imageCompression(file, compressionOptions);
        
        console.log(`${file.name}: ${this.formatFileSize(file.size)} → ${this.formatFileSize(compressedFile.size)}`);

        // Check individual file size after compression
        if (compressedFile.size > this.MAX_FILE_SIZE) {
          errors.push(`${file.name} is still too large after compression (${this.formatFileSize(compressedFile.size)}). Please use a smaller image.`);
          continue;
        }

        totalSize += compressedFile.size;
        validFiles.push(compressedFile);
      } catch (error) {
        console.error('Error compressing', file.name, error);
        errors.push(`Failed to process ${file.name}. Please try a different image.`);
      }
    }

    // Check total size (including architectural drawings already selected)
    const drawingsSize = this.architecturalDrawings.reduce((sum, f) => sum + f.size, 0);
    if (totalSize + drawingsSize > this.MAX_TOTAL_SIZE) {
      errors.push(`Total upload size (${this.formatFileSize(totalSize + drawingsSize)}) exceeds 40MB. Please select fewer images.`);
      event.target.value = '';
      this.galleryImages = [];
    } else {
      this.galleryImages = validFiles;
      console.log(`✅ ${validFiles.length} images ready. Total: ${this.formatFileSize(totalSize)}`);
    }

    if (errors.length > 0) {
      this.submitError = errors.join('\n');
      setTimeout(() => this.submitError = null, 8000);
    }
  }

  async onDrawingsSelected(event: any) {
    const files: FileList = event.target.files;
    const validFiles: File[] = [];
    let totalSize = 0;
    const errors: string[] = [];

    // Compression options for architectural drawings (higher quality)
    const compressionOptions = {
      maxSizeMB: 1.5,
      maxWidthOrHeight: 3000,  // Higher res for architectural drawings
      useWebWorker: true,
      initialQuality: 0.9      // Higher quality for technical drawings
    };

    console.log('Processing', files.length, 'drawings...');

    for (let i = 0; i < files.length; i++) {
      const file = files[i];
      
      // PDFs don't get compressed, only images
      if (file.type === 'application/pdf') {
        if (file.size > this.MAX_FILE_SIZE) {
          errors.push(`${file.name} is too large (${this.formatFileSize(file.size)}). Max 10MB per file.`);
          continue;
        }
        console.log(`${file.name}: ${this.formatFileSize(file.size)} (PDF - no compression)`);
        totalSize += file.size;
        validFiles.push(file);
      } else if (file.type.startsWith('image/')) {
        try {
          const compressedFile = await imageCompression(file, compressionOptions);
          console.log(`${file.name}: ${this.formatFileSize(file.size)} → ${this.formatFileSize(compressedFile.size)}`);
          
          if (compressedFile.size > this.MAX_FILE_SIZE) {
            errors.push(`${file.name} is still too large after compression. Please use a smaller file.`);
            continue;
          }
          
          totalSize += compressedFile.size;
          validFiles.push(compressedFile);
        } catch (error) {
          console.error('Error compressing', file.name, error);
          errors.push(`Failed to process ${file.name}.`);
        }
      } else {
        errors.push(`${file.name} must be an image or PDF.`);
      }
    }

    // Check total size (including gallery images already selected)
    const gallerySize = this.galleryImages.reduce((sum, f) => sum + f.size, 0);
    if (totalSize + gallerySize > this.MAX_TOTAL_SIZE) {
      errors.push(`Total upload size (${this.formatFileSize(totalSize + gallerySize)}) exceeds 40MB limit.`);
      event.target.value = '';
      this.architecturalDrawings = [];
    } else {
      this.architecturalDrawings = validFiles;
      console.log(`✅ ${validFiles.length} drawings ready. Total: ${this.formatFileSize(totalSize)}`);
    }

    if (errors.length > 0) {
      this.submitError = errors.join('\n');
      setTimeout(() => this.submitError = null, 8000);
    }
  }

  // Helper to format file size for display
  private formatFileSize(bytes: number): string {
    if (bytes < 1024) return bytes + ' B';
    if (bytes < 1024 * 1024) return (bytes / 1024).toFixed(2) + ' KB';
    return (bytes / (1024 * 1024)).toFixed(2) + ' MB';
  }

  // ----------- SUBMIT FORM ------------------

  submit() {
    if (!this.projectForm.valid) {
      this.submitError = 'Please fill in all required fields.';
      return;
    }

    // Final size check before submission
    const totalUploadSize = [...this.galleryImages, ...this.architecturalDrawings]
      .reduce((sum, file) => sum + file.size, 0);
    
    if (totalUploadSize > this.MAX_TOTAL_SIZE) {
      this.submitError = `Total upload size (${this.formatFileSize(totalUploadSize)}) exceeds 40MB. Please reduce file sizes or quantity.`;
      return;
    }

    this.isSubmitting = true;
    this.submitError = null;

    const scopeText = this.projectForm.get('scope')?.value || '';
    const scope = scopeText.split('\n').map((item: string) => item.trim()).filter((item: string) => item);

    if (this.isEditing && this.editingProjectId) {
      // Update existing project
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
      formData.append('scope', JSON.stringify(scope));

      this.galleryImages.forEach((file) => {
        formData.append('galleryImages', file, file.name);
      });

      this.architecturalDrawings.forEach((file) => {
        formData.append('architecturalDrawings', file, file.name);
      });

      console.log('FormData created with:');
      console.log('- Title:', this.projectForm.get('projectTitle')?.value);
      console.log('- Gallery images:', this.galleryImages.length, `(${this.formatFileSize(this.galleryImages.reduce((s, f) => s + f.size, 0))})`);
      console.log('- Architectural drawings:', this.architecturalDrawings.length, `(${this.formatFileSize(this.architecturalDrawings.reduce((s, f) => s + f.size, 0))})`);
      console.log('- Total size:', this.formatFileSize(totalUploadSize));

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

    for (const file of this.galleryImages) {
      try {
        const base64 = await this.fileToBase64(file);
        mediaCreates.push({
          encodedFile: base64,
          mediaType: 'IMAGE',
          mediaGroup: 'IMAGES',
          title: file.name,
          alt: file.name,
          isDefault: mediaCreates.length === 0
        });
      } catch (e) {
        console.error('Error processing gallery image:', file.name, e);
      }
    }

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
        const base64Data = base64.split(',')[1];
        resolve(base64Data);
      };
      reader.onerror = error => reject(error);
    });
  }
}