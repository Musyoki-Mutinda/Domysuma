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

  // Pagination properties
  currentPage: number = 1;
  hasNext: boolean = false;
  hasPrevious: boolean = false;

  constructor(private router: Router) { }

  ngOnInit(): void {
    this.loadCareers(1);
  }

  loadCareers(page: number = 1): void {
    this.loading = true;
    this.error = null;

    console.log('Attempting to fetch careers from API...');

    fetch(`https://staff.domysumaarchitects.co.ke/api/recruitments?page=${page}&per_page=8`)
      .then(response => {
        console.log('API Response:', response);
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }
        return response.json();
      })
      .then(data => {
        console.log('API Data:', data);
        this.careers = data.data || [];
        console.log('Careers to display:', this.careers);
        this.hasNext = !!data.next_page_url;
        this.hasPrevious = !!data.prev_page_url;
        this.currentPage = data.current_page;
        this.loading = false;
      })
      .catch(error => {
        console.error('Error loading careers:', error);
        this.error = `Failed to load job opportunities: ${error.message}`;
        this.loading = false;
      });
  }

  apply(job: any): void {
    if (job.id) {
      this.router.navigate(['/careers', job.id]);
    } else {
      console.error('Job has no id:', job);
      alert('Error: No job ID available');
    }
  }

  // Pagination methods
  nextPage(): void {
    if (this.hasNext) {
      this.loadCareers(this.currentPage + 1);
    }
  }

  previousPage(): void {
    if (this.hasPrevious) {
      this.loadCareers(this.currentPage - 1);
    }
  }
}