import { Component, OnInit } from '@angular/core';
import { BlogService } from '../blog.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-blog-list',
  templateUrl: './list.component.html',
  styleUrls: ['./list.component.scss']
})
export class BlogListComponent implements OnInit {
  blogs: any[] = [];
  settings = false;
  blogSettings: any = {
    useCustomBlogs: false,
    customBlogs: []
  };

  constructor(private blogService: BlogService, private router: Router) { }

  ngOnInit(): void {
    this.loadBlogSettings();
    this.loadBlogs();
  }

  loadBlogSettings(): void {
    this.blogService.getBlogSettings().subscribe(
      (settings) => {
        this.blogSettings = settings;
      },
      (error) => {
        console.error('Error loading blog settings:', error);
      }
    );
  }

  loadBlogs(): void {
    this.blogService.getBlogs().subscribe(
      (blogs) => {
        this.blogs = blogs;
      },
      (error) => {
        console.error('Error loading blogs:', error);
      }
    );
  }

  toggleBlogSource(checked: boolean): void {
    this.blogSettings.useCustomBlogs = checked;
    this.blogService.updateBlogSettings(this.blogSettings).subscribe(
      () => {
        console.log('Blog settings updated');
      },
      (error) => {
        console.error('Error updating blog settings:', error);
        this.blogSettings.useCustomBlogs = !checked;
      }
    );
  }

  editBlog(blog: any): void {
    this.router.navigate(['/blogs/edit', blog.id]);
  }

  deleteBlog(blog: any): void {
    if (window.confirm('Are you sure you want to delete this blog post?')) {
      this.blogService.deleteBlog(blog.id).subscribe(
        () => {
          this.loadBlogs();
        },
        (error) => {
          console.error('Error deleting blog:', error);
        }
      );
    }
  }
}
