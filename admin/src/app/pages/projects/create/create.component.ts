import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-design-create',
  templateUrl: './create.component.html',
})
export class CreateComponent implements OnInit {

  projectForm!: FormGroup;

  // Store selected files
  galleryImages: File[] = [];
  architecturalDrawings: File[] = [];

  constructor(private fb: FormBuilder) {}

  ngOnInit(): void {
    this.projectForm = this.fb.group({
      projectTitle: ['', Validators.required],
      category: ['', Validators.required],
      briefDescription: ['', Validators.required],
      countyTown: [''],
      location: [''],
      floorArea: [''],
      structuralSystem: [''],
      interiorFeatures: [''],
      additionalNotes: [''],
      yearCompleted: [''],
      architectName: [''],
    });
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
      alert('Please fill in all required fields.');
      return;
    }

    // Spring Boot requires multipart/form-data for file uploads
    const formData = new FormData();

    // Append text fields
    Object.keys(this.projectForm.controls).forEach(key => {
      const value = this.projectForm.get(key)?.value;
      formData.append(key, value);
    });

    // Append gallery images (multiple)
    this.galleryImages.forEach((file, index) => {
      formData.append('galleryImages', file);
    });

    // Append architectural drawings
    this.architecturalDrawings.forEach((file, index) => {
      formData.append('architecturalDrawings', file);
    });

    console.log('FormData ready to send to Spring Boot.');

    // Example call:
    // this.projectService.createProject(formData).subscribe(
    //   (res) => console.log("Uploaded!", res),
    //   (err) => console.error("Upload error:", err)
    // );

    alert('Project created successfully (frontend only for now).');
  }
}
