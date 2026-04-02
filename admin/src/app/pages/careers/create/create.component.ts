import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { FormBuilder, FormGroup, FormArray, Validators } from '@angular/forms';
import { CareersService, Job } from '../careers.service';

@Component({
  selector: 'app-careers-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class CareersCreateComponent implements OnInit {
  jobForm: FormGroup;
  isEditMode: boolean = false;
  jobId: number | null = null;
  loading: boolean = false;
  saving: boolean = false;
  error: string | null = null;

  constructor(
    private fb: FormBuilder,
    private careersService: CareersService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.jobForm = this.createForm();
  }

  ngOnInit(): void {
    this.checkEditMode();
  }

  private createForm(): FormGroup {
    return this.fb.group({
      title: ['', [Validators.required, Validators.minLength(3)]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      responsibilities: this.fb.array([]),
      requirements: this.fb.array([]),
      is_active: [true]
    });
  }

  private checkEditMode(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.isEditMode = true;
      this.jobId = +id;
      this.loadJob(this.jobId);
    } else {
      // Add default empty items for new jobs
      this.addResponsibility();
      this.addRequirement();
    }
  }

  private loadJob(id: number): void {
    this.loading = true;
    this.careersService.getJob(id).subscribe({
      next: (job) => {
        this.populateForm(job);
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading job:', error);
        this.error = 'Failed to load job';
        this.loading = false;
      }
    });
  }

  private populateForm(job: Job): void {
    this.jobForm.patchValue({
      title: job.title,
      description: job.description,
      is_active: job.is_active ?? true
    });

    // Clear existing arrays
    this.responsibilities.clear();
    this.requirements.clear();

    // Populate responsibilities
    if (job.responsibilities && job.responsibilities.length > 0) {
      job.responsibilities.forEach(resp => {
        this.addResponsibility(resp);
      });
    } else {
      this.addResponsibility();
    }

    // Populate requirements
    if (job.requirements && job.requirements.length > 0) {
      job.requirements.forEach(req => {
        this.addRequirement(req);
      });
    } else {
      this.addRequirement();
    }
  }

  // Getters for FormArrays
  get responsibilities(): FormArray {
    return this.jobForm.get('responsibilities') as FormArray;
  }

  get requirements(): FormArray {
    return this.jobForm.get('requirements') as FormArray;
  }

  // Add/Remove responsibilities
  addResponsibility(value: string = ''): void {
    this.responsibilities.push(this.fb.control(value, Validators.required));
  }

  removeResponsibility(index: number): void {
    if (this.responsibilities.length > 1) {
      this.responsibilities.removeAt(index);
    }
  }

  // Add/Remove requirements
  addRequirement(value: string = ''): void {
    this.requirements.push(this.fb.control(value, Validators.required));
  }

  removeRequirement(index: number): void {
    if (this.requirements.length > 1) {
      this.requirements.removeAt(index);
    }
  }

  onSubmit(): void {
    if (this.jobForm.invalid) {
      this.markFormGroupTouched();
      return;
    }

    this.saving = true;
    this.error = null;

    const formValue = this.jobForm.value;
    const jobData: Omit<Job, 'id'> = {
      title: formValue.title,
      description: formValue.description,
      responsibilities: formValue.responsibilities.filter((r: string) => r.trim()),
      requirements: formValue.requirements.filter((r: string) => r.trim()),
      is_active: formValue.is_active
    };

    const saveOperation = this.isEditMode && this.jobId
      ? this.careersService.updateJob(this.jobId, jobData)
      : this.careersService.createJob(jobData);

    saveOperation.subscribe({
      next: (job) => {
        this.saving = false;
        this.router.navigate(['/careers']);
      },
      error: (error) => {
        console.error('Error saving job:', error);
        this.error = 'Failed to save job';
        this.saving = false;
      }
    });
  }

  private markFormGroupTouched(): void {
    Object.keys(this.jobForm.controls).forEach(key => {
      const control = this.jobForm.get(key);
      if (control) {
        control.markAsTouched();
      }
    });
  }

  viewAllJobs(): void {
    this.router.navigate(['/careers/list']);
  }

  cancel(): void {
    this.router.navigate(['/careers']);
  }

  // Helper methods for template
  isFieldInvalid(fieldName: string): boolean {
    const field = this.jobForm.get(fieldName);
    return !!(field && field.invalid && field.touched);
  }

  getFieldError(fieldName: string): string {
    const field = this.jobForm.get(fieldName);
    if (field && field.errors && field.touched) {
      if (field.errors['required']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} is required`;
      }
      if (field.errors['minlength']) {
        return `${fieldName.charAt(0).toUpperCase() + fieldName.slice(1)} must be at least ${field.errors['minlength'].requiredLength} characters`;
      }
    }
    return '';
  }
}