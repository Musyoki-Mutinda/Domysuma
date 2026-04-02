import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { BlogService } from '../blog.service';
import { Router, ActivatedRoute } from '@angular/router';
import { NbToastrService } from '@nebular/theme';

@Component({
  selector: 'app-blog-create',
  templateUrl: './create.component.html',
  styleUrls: ['./create.component.scss']
})
export class BlogCreateComponent implements OnInit {
  blogForm: FormGroup;
  categories = ['All', 'Residential', 'Commercial', 'Interior', 'Urban', 'Sustainability'];
  isEditing = false;
  blogId: string | null;

  constructor(
    private fb: FormBuilder,
    private blogService: BlogService,
    private router: Router,
    private route: ActivatedRoute,
    private toastrService: NbToastrService
  ) {
    this.blogForm = this.fb.group({
      title: ['', Validators.required],
      author: ['', Validators.required],
      category: ['', Validators.required],
      date: [new Date(), Validators.required],
      image: ['', Validators.required],
      excerpt: ['', Validators.required],
      content: ['', Validators.required],
      slug: ['', Validators.required],
      link: [''],
      tags: [''],
      readTime: [''],
      featured: [false],
      location: [''],
      projectType: [''],
     建筑面积: ['']
    });
    this.blogId = null;
  }

  ngOnInit(): void {
    this.blogId = this.route.snapshot.paramMap.get('id');
    if (this.blogId) {
      this.isEditing = true;
      this.loadBlog();
    }

    // Auto-generate slug from title
    this.blogForm.get('title')?.valueChanges.subscribe(title => {
      if (title) {
        const slug = title.toLowerCase()
          .replace(/[^\w\s-]/g, '')
          .replace(/\s+/g, '-')
          .trim();
        this.blogForm.get('slug')?.setValue(slug);
      }
    });

    // Auto-calculate read time based on content length
    this.blogForm.get('content')?.valueChanges.subscribe(content => {
      if (content) {
        const wordsPerMinute = 200;
        const wordCount = content.split(/\s+/).length;
        const readTime = Math.ceil(wordCount / wordsPerMinute);
        this.blogForm.get('readTime')?.setValue(readTime + ' min read');
      }
    });
  }

  loadBlog(): void {
    if (this.blogId) {
      this.blogService.getBlog(this.blogId).subscribe(
        (blog) => {
          this.blogForm.patchValue(blog);
          this.blogForm.get('date')?.setValue(new Date(blog.date));
        },
        (error) => {
          console.error('Error loading blog:', error);
          this.toastrService.danger('Error loading blog. Please try again.');
        }
      );
    }
  }

  onSubmit(): void {
    if (this.blogForm.invalid) {
      this.blogForm.markAllAsTouched();
      return;
    }

    const blogData = this.blogForm.value;

    if (this.isEditing && this.blogId) {
      this.blogService.updateBlog(this.blogId, blogData).subscribe(
        () => {
          this.toastrService.success('Blog post updated successfully');
          this.router.navigate(['/blogs']);
        },
        (error) => {
          console.error('Error updating blog post:', error);
          this.toastrService.danger('Error updating blog post. Please try again.');
        }
      );
    } else {
      this.blogService.createBlog(blogData).subscribe(
        () => {
          this.toastrService.success('Blog post created successfully');
          this.router.navigate(['/blogs']);
        },
        (error) => {
          console.error('Error creating blog post:', error);
          this.toastrService.danger('Error creating blog post. Please try again.');
        }
      );
    }
  }

  onCancel(): void {
    this.router.navigate(['/blogs']);
  }
}
