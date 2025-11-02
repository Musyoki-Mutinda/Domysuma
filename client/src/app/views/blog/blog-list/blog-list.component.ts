import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-blog-list',
  templateUrl: './blog-list.component.html',
  styleUrls: ['./blog-list.component.scss']
})
export class BlogListComponent implements OnInit {

  blogPosts: any[] = [];
  allPosts: any[] = []; // store all posts before filtering
  loading = true;
  error = false;

  // ✅ Category filters
  categories = ['All', 'Residential', 'Commercial', 'Interior', 'Urban', 'Sustainability'];
  selectedCategory = 'All';

  // ✅ Local fallback posts
  localPosts = [
    {
      title: 'Modern House Design in Nairobi',
      author: 'Leone Mutinda',
      date: new Date('2025-09-01'),
      image: '/assets/images/blog1.jpg',
      excerpt: 'A look into modern residential architecture inspired by minimalism.',
      category: 'Residential',
      link: '/blog/modern-house-nairobi'
    },
    {
      title: 'Sustainable Building Practices in Kenya',
      author: 'Domysuma Team',
      date: new Date('2025-08-20'),
      image: '/assets/images/blog2.jpg',
      excerpt: 'Exploring eco-friendly materials shaping construction in East Africa.',
      category: 'Sustainability',
      link: '/blog/sustainable-building-kenya'
    },
    {
      title: 'The Future of Urban Planning in Africa',
      author: 'Domysuma Insights',
      date: new Date('2025-07-15'),
      image: '/assets/images/blog3.jpg',
      excerpt: 'A vision for more sustainable, people-centered African cities.',
      category: 'Urban',
      link: '/blog/urban-planning-africa'
    }
  ];

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.fetchArchDailyFeed();
  }

  /**
   * Fetches live ArchDaily feed via RSS-to-JSON API
   * Falls back to local posts if request fails
   */
  fetchArchDailyFeed(): void {
    const rssToJsonUrl =
      'https://api.rss2json.com/v1/api.json?rss_url=https://www.archdaily.com/feed.xml';

    this.http.get<any>(rssToJsonUrl).subscribe({
      next: (res) => {
        if (res.status === 'ok' && res.items?.length) {
          this.allPosts = res.items.map((item: any) => ({
            title: item.title,
            author: item.author || 'ArchDaily',
            date: new Date(item.pubDate),
            image: item.enclosure?.link || '/assets/images/placeholder.jpg',
            excerpt: item.contentSnippet || '',
            link: item.link,
            category: this.detectCategory(item.title)
          }));
        } else {
          console.warn('⚠️ ArchDaily returned no data — using fallback posts.');
          this.allPosts = this.localPosts;
        }

        this.blogPosts = this.allPosts;
        this.loading = false;
      },
      error: (err) => {
        console.error('❌ Error fetching ArchDaily feed:', err);
        this.error = true;
        this.allPosts = this.localPosts;
        this.blogPosts = this.localPosts; // ✅ fallback
        this.loading = false;
      }
    });
  }

  /**
   * Roughly detects article category based on title keywords
   */
  private detectCategory(title: string): string {
    const lower = title.toLowerCase();
    if (lower.includes('residential') || lower.includes('house')) return 'Residential';
    if (lower.includes('office') || lower.includes('commercial')) return 'Commercial';
    if (lower.includes('interior')) return 'Interior';
    if (lower.includes('urban')) return 'Urban';
    if (lower.includes('sustain') || lower.includes('green')) return 'Sustainability';
    return 'All';
  }

  /**
   * Filters blog posts by selected category
   */
  filterByCategory(category: string): void {
    this.selectedCategory = category;

    if (category === 'All') {
      this.blogPosts = this.allPosts;
    } else {
      this.blogPosts = this.allPosts.filter(
        (post) => post.category === category
      );
    }
  }
}
