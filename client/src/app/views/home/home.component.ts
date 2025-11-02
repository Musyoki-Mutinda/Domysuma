import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {
  featuredBlogs: any[] = [];
  loading = true;  // ✅ Added to match your template
  error = false;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchFeaturedBlogs();
  }

  /**
   * Fetches latest blog posts (2 only)
   * from ArchDaily feed as featured blogs
   */
  fetchFeaturedBlogs(): void {
    const rssToJsonUrl =
      'https://api.rss2json.com/v1/api.json?rss_url=https://www.archdaily.com/feed.xml';

    this.http.get<any>(rssToJsonUrl).subscribe({
      next: (res) => {
        if (res.status === 'ok' && res.items?.length) {
          // Pick only the first two posts for the homepage
          this.featuredBlogs = res.items.slice(0, 2).map((item: any) => ({
            title: item.title,
            author: item.author || 'ArchDaily',
            date: new Date(item.pubDate),
            image: item.enclosure?.link || '/assets/images/placeholder.jpg',
            excerpt: item.contentSnippet || '',
            link: item.link
          }));
        } else {
          console.warn('⚠️ No blog data found for homepage.');
          this.featuredBlogs = [];
        }
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Error fetching blog feed:', err);
        this.error = true;
        this.loading = false;
      }
    });
  }

  /**
   * Opens external link safely (since templates can’t use window directly)
   */
  openPost(url: string): void {
    window.open(url, '_blank');
  }
}
