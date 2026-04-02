import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class BlogService {
  private apiUrl = 'https://api.domysuma.com/blogs'; // Replace with your actual API endpoint

  constructor(private http: HttpClient) { }

  getBlogs(): Observable<any[]> {
    return this.http.get<any[]>(`${this.apiUrl}`);
  }

  getBlog(id: string): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/${id}`);
  }

  createBlog(blog: any): Observable<any> {
    return this.http.post<any>(`${this.apiUrl}`, blog);
  }

  updateBlog(id: string, blog: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/${id}`, blog);
  }

  deleteBlog(id: string): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`);
  }

  getBlogSettings(): Observable<any> {
    return this.http.get<any>(`${this.apiUrl}/settings`);
  }

  updateBlogSettings(settings: any): Observable<any> {
    return this.http.put<any>(`${this.apiUrl}/settings`, settings);
  }
}
