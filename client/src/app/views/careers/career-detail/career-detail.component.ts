import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

@Component({
  selector: 'app-career-detail',
  templateUrl: './career-detail.component.html',
  styleUrls: ['./career-detail.component.scss']
})
export class CareerDetailComponent implements OnInit {
  job: any = null;
  loading: boolean = true;
  error: string | null = null;
  submitting: boolean = false;
  applicationSuccess: boolean = false;

  // Application form data
  application = {
    name: '',
    email: '',
    phone: '',
    cv: null as File | null,
    coverLetter: null as File | null
  };

  constructor(
    private route: ActivatedRoute,
    private router: Router
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.loadJob(id);
    }
  }

  loadJob(id: string): void {
    this.loading = true;
    this.error = null;

    fetch('https://staff.domysumaarchitects.co.ke/api/recruitments')
      .then(response => {
        if (!response.ok) {
          throw new Error('Failed to load jobs');
        }
        return response.json();
      })
      .then(data => {
        const jobs = Array.isArray(data) ? data : (data.data || data.recruitments || []);
        this.job = jobs.find((job: any) => job.id == id);

        if (!this.job) {
          throw new Error('Job not found');
        }

        this.loading = false;
      })
      .catch(error => {
        console.error('Error loading job:', error);
        this.error = error.message;
        this.loading = false;
      });
  }

  onCvChange(event: any): void {
    if (event.target.files.length > 0) {
      this.application.cv = event.target.files[0];
    }
  }

  onCoverLetterChange(event: any): void {
    if (event.target.files.length > 0) {
      this.application.coverLetter = event.target.files[0];
    }
  }

  onSubmit(): void {
    if (!this.validateForm()) {
      return;
    }

    this.submitting = true;

    const payload = this.prepareApplicationData();

    console.log(`\n===== APPLICATION SUBMITTED =====`);
    console.log(`Job ID: ${this.job.id} | Position: ${this.job.title}`);
    console.log(`Payload:`, JSON.stringify(payload, null, 2));
    console.log(`=================================\n`);

    fetch('https://staff.domysumaarchitects.co.ke/api/submitthis', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify(payload)
    })
    .then(response => {
      if (!response.ok) {
        return response.json().then(errData => {
          console.error('Server validation errors:', JSON.stringify(errData, null, 2));
          throw new Error(JSON.stringify(errData));
        });
      }
      return response.json();
    })
    .then(data => {
      console.log('Application submitted successfully:', data);
      this.submitting = false;
      this.applicationSuccess = true;

      // Reset the form
      this.application = {
        name: '',
        email: '',
        phone: '',
        cv: null,
        coverLetter: null
      };

      window.scrollTo({ top: 0, behavior: 'smooth' });
    })
    .catch(error => {
      console.error('Error submitting application:', error);
      this.submitting = false;
      this.error = 'Failed to submit application. Please try again.';
    });
  }

  prepareApplicationData(): any {
    return {
      job_id: this.job.id,
      position_id: this.job.position_id,
      job_title: this.job.title,
      applicant: {
        name: this.application.name,
        email: this.application.email,
        phone: this.application.phone
      },
      documents: {
        cv: {
          filename: this.application.cv?.name,
          size: this.application.cv?.size,
          type: this.application.cv?.type
        },
        cover_letter: {
          filename: this.application.coverLetter?.name,
          size: this.application.coverLetter?.size,
          type: this.application.coverLetter?.type
        }
      },
      submitted_at: new Date().toISOString(),
      status: 'pending'
    };
  }

  validateForm(): boolean {
    if (!this.application.name || !this.application.email || !this.application.phone) {
      alert('Please fill in all required fields');
      return false;
    }

    if (!this.isValidEmail(this.application.email)) {
      alert('Please enter a valid email address');
      return false;
    }

    if (!this.application.cv) {
      alert('Please upload your CV');
      return false;
    }

    if (!this.application.coverLetter) {
      alert('Please upload your cover letter');
      return false;
    }

    return true;
  }

  isValidEmail(email: string): boolean {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  }

  goBack(): void {
    this.router.navigate(['/careers']);
  }
}