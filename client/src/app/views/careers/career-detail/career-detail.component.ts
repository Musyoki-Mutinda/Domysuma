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

  // Modal properties
  isJobModalOpen: boolean = false;

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

    // Fetch the individual job directly by ID instead of fetching all jobs and filtering
    fetch(`https://staff.domysumaarchitects.co.ke/api/recruitments/${id}`)
      .then(response => {
        if (!response.ok) {
          throw new Error('Job not found');
        }
        return response.json();
      })
      .then(data => {
        // API may return the job directly or nested under a key
        this.job = data.data || data.recruitment || data;

        if (!this.job || !this.job.id) {
          throw new Error('Job not found');
        }

        this.setRoleBasedData();
        this.loading = false;
      })
      .catch(error => {
        console.error('Error loading job:', error);
        this.error = error.message;
        this.loading = false;
      });
  }

  setRoleBasedData(): void {
    if (!this.job) return;
    this.job.responsibilities = this.getResponsibilities(this.job.title || '');
    this.job.requirements = this.getRequirements(this.job.title || '');
  }

  getResponsibilities(title: string): string[] {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('architect')) {
      return [
        "Develop conceptual, schematic, and detailed architectural designs for residential, commercial, and institutional projects in Kenya",
        "Conduct site analysis, feasibility studies, and environmental impact assessments in compliance with Kenyan regulations",
        "Collaborate with clients, engineers, landscape architects, and interior designers to ensure cohesive project outcomes",
        "Ensure all designs comply with Kenyan building codes, zoning laws, and sustainable development standards",
        "Prepare and review construction drawings, specifications, and cost estimates using local standards",
        "Oversee construction phases, conduct site inspections, and manage project timelines within the Kenyan context",
        "Utilize CAD software (AutoCAD, Revit) and BIM technology for design and documentation",
        "Participate in client presentations and obtain necessary approvals from Kenyan regulatory bodies such as NCA and local authorities"
      ];
    } else if (lowerTitle.includes('interior designer') || lowerTitle.includes('interior')) {
      return [
        "Create functional and aesthetically pleasing interior spaces for residential and commercial projects in Kenya",
        "Develop design concepts, mood boards, and presentation materials for client approval, incorporating local cultural elements",
        "Select appropriate materials, furniture, lighting, and color schemes suitable for the Kenyan market",
        "Collaborate with architects, contractors, and suppliers to ensure design implementation",
        "Prepare detailed drawings, specifications, and procurement lists",
        "Oversee installation and ensure quality control throughout the project",
        "Stay updated with current design trends and sustainable materials available in Kenya",
        "Conduct space planning and ergonomic assessments tailored to local needs"
      ];
    } else {
      return [
        "Perform duties related to the specific role as outlined in the job description within the Kenyan architectural and construction industry",
        "Collaborate with team members to achieve project goals and maintain professional standards",
        "Maintain compliance with company policies and local regulations",
        "Contribute to continuous improvement and innovation in the workplace"
      ];
    }
  }

  getRequirements(title: string): string[] {
    const lowerTitle = title.toLowerCase();
    if (lowerTitle.includes('architect')) {
      return [
        "Bachelor's degree in Architecture from a recognized institution in Kenya or internationally accredited",
        "Registration with the Architectural Association of Kenya (AAK) and Board of Registration of Architects and Quantity Surveyors (BORAQS)",
        "Proficiency in AutoCAD, Revit, SketchUp, and other relevant design software",
        "Minimum 3-5 years of experience in architectural design and project management",
        "Strong understanding of Kenyan building codes, standards, and local construction practices",
        "Excellent communication, presentation, and project management skills",
        "Knowledge of sustainable design principles and green building standards",
        "Valid practicing license and membership in relevant professional bodies"
      ];
    } else if (lowerTitle.includes('interior designer') || lowerTitle.includes('interior')) {
      return [
        "Diploma or Bachelor's degree in Interior Design or related field from a recognized institution",
        "Certification from relevant professional bodies such as International Interior Design Association (IIDA) preferred",
        "Proficiency in design software including AutoCAD, SketchUp, 3ds Max, or similar tools",
        "Portfolio demonstrating experience in interior design projects",
        "Knowledge of materials, furniture, and finishes available in the Kenyan market",
        "Understanding of space planning, lighting design, and ergonomics",
        "Minimum 2-3 years of experience in interior design",
        "Strong creative vision and attention to detail"
      ];
    } else {
      return [
        "Relevant qualification in the field from a recognized institution",
        "Experience in the architectural or construction industry preferred",
        "Knowledge of local regulations and industry standards",
        "Strong work ethic and willingness to learn",
        "Good communication and teamwork skills"
      ];
    }
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

  // Modal methods
  openJobModal(): void {
    this.isJobModalOpen = true;
  }

  closeJobModal(): void {
    this.isJobModalOpen = false;
  }
}