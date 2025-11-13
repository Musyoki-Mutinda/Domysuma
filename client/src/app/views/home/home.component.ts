import { Component, OnInit } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit {

  /* BLOG DATA */
  featuredBlogs: any[] = [];
  loading = true;
  error = false;

  /* HERO CAROUSEL */
  images = [
    'assets/carousel/carousel_1.jpg',
    'assets/carousel/carousel_2.jpg',
    'assets/carousel/carousel_3.jpg',
    'assets/carousel/carousel_4.jpg',
    'assets/carousel/carousel_5.jpg',
    'assets/carousel/carousel_6.jpg',
    'assets/carousel/carousel_7.jpg',
  ];
  currentIndex = 0;
  private carouselInterval: any;

  constructor(private http: HttpClient) {}

  ngOnInit(): void {
    this.startCarousel();
    this.fetchFeaturedBlogs();
  }

  ngOnDestroy(): void {
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
    }
  }

   /* CAROUSEL LOGIC */
  startCarousel(): void {
    this.carouselInterval = setInterval(() => {
      this.currentIndex = (this.currentIndex + 1) % this.images.length;
    }, 8000); // Change image every 8 seconds
  }

  selectSlide(index: number): void {
    this.currentIndex = index;
  }

  /* BLOG FETCHING */
  fetchFeaturedBlogs(): void {
    const rssToJsonUrl =
      'https://api.rss2json.com/v1/api.json?rss_url=https://www.archdaily.com/feed.xml';

    this.http.get<any>(rssToJsonUrl).subscribe({
      next: (res) => {
        if (res.status === 'ok' && res.items?.length) {
          this.featuredBlogs = res.items.slice(0, 2).map((item: any) => ({
            title: item.title,
            author: item.author || 'ArchDaily',
            date: new Date(item.pubDate),
            image: item.enclosure?.link || '/assets/images/placeholder.jpg',
            excerpt: item.contentSnippet || '',
            link: item.link
          }));
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

  openPost(url: string): void {
    window.open(url, '_blank');
  }
}
