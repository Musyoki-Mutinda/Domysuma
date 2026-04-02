import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { NbDialogService } from '@nebular/theme';
import { CareersService, Job } from '../careers.service';

@Component({
  selector: 'app-careers-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class CareersListComponent implements OnInit {
  jobs: Job[] = [];
  loading: boolean = true;
  error: string | null = null;

  constructor(
    private careersService: CareersService,
    private router: Router,
    private dialogService: NbDialogService
  ) { }

  ngOnInit(): void {
    this.loadJobs();
  }

  loadJobs(): void {
    this.loading = true;
    this.error = null;

    this.careersService.getJobs().subscribe({
      next: (jobs) => {
        this.jobs = jobs;
        this.loading = false;
      },
      error: (error) => {
        console.error('Error loading jobs:', error);
        this.error = 'Failed to load jobs';
        this.loading = false;
      }
    });
  }

  createJob(): void {
    this.router.navigate(['/careers/create']);
  }

  editJob(job: Job): void {
    this.router.navigate(['/careers/edit', job.id]);
  }

  deleteJob(job: Job): void {
    if (!job.id) return;

    if (confirm(`Are you sure you want to delete "${job.title}"?`)) {
      this.careersService.deleteJob(job.id).subscribe({
        next: () => {
          this.loadJobs(); // Reload the list
        },
        error: (error) => {
          console.error('Error deleting job:', error);
          alert('Failed to delete job');
        }
      });
    }
  }

  toggleJobStatus(job: Job): void {
    if (!job.id) return;

    const newStatus = !job.is_active;
    this.careersService.toggleJobStatus(job.id, newStatus).subscribe({
      next: (updatedJob) => {
        job.is_active = updatedJob.is_active;
      },
      error: (error) => {
        console.error('Error updating job status:', error);
        alert('Failed to update job status');
      }
    });
  }
}