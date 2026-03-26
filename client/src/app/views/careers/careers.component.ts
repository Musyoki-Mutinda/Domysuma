import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-careers',
  templateUrl: './careers.component.html',
  styleUrls: ['./careers.component.scss']
})
export class CareersComponent implements OnInit {
  careers: any[] = [];
  loading: boolean = true;
  error: string | null = null;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.loadCareers();
  }

  loadCareers(): void {
    this.loading = true;
    this.error = null;

    console.log('Attempting to fetch careers from API...');

    // Fetch careers from the API endpoint
    fetch('https://staff.domysumaarchitects.co.ke/api/recruitments')
      .then(response => {
        console.log('API Response:', response);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('API Data:', data);
        // Check if data is an array or needs to be extracted from an object
        this.careers = Array.isArray(data) ? data : (data.data || data.recruitments || []);
        console.log('Careers to display:', this.careers);
        this.loading = false;
      })
      .catch(error => {
        console.error('Error loading careers:', error);
        this.error = `Failed to load job opportunities: ${error.message}`;
        this.loading = false;
      });
  }

  apply(job: any): void {
    // Navigate to the job detail page
    if (job.id) {
      this.router.navigate(['/careers', job.id]);
    } else {
      console.error('Job has no id:', job);
      alert('Error: No job ID available');
    }
  }
}
