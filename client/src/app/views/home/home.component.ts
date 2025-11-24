import { Component, OnInit, OnDestroy } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';

/* IMPORT the shared project categories */
import { PROJECT_CATEGORIES } from '../../shared/data/project-categories.data'

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent implements OnInit, OnDestroy {

  /* BLOG DATA */
  featuredBlogs: any[] = [];
  loading = true;
  error = false;

  /* CATEGORY PREVIEW — loaded from shared file */
  categoriesPreview: any[] = [];

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
  private carouselInterval!: ReturnType<typeof setInterval>;

  constructor(private http: HttpClient, private router: Router) {}

  /* TYPING EFFECT */
  currentWord = '';
  private fullWord = 'Architects';
  private isDeleting = false;
  private typingSpeed = 150;
  private deletingSpeed = 100;
  private pauseTime = 1500;

  ngOnInit(): void {
    this.startCarousel();
    this.fetchFeaturedBlogs();
    this.typeEffect();

    /* Load only first 4 categories from shared source */
    this.categoriesPreview = PROJECT_CATEGORIES.slice(0, 4);
  }

  /** Typing animation for the "Architects" hero text */
  typeEffect(): void {
    const full = this.fullWord;

    if (this.isDeleting) {
      this.currentWord = full.substring(0, this.currentWord.length - 1);
    } else {
      this.currentWord = full.substring(0, this.currentWord.length + 1);
    }

    let delay = this.isDeleting ? this.deletingSpeed : this.typingSpeed;

    if (!this.isDeleting && this.currentWord === full) {
      delay = this.pauseTime;
      this.isDeleting = true;
    } else if (this.isDeleting && this.currentWord === '') {
      this.isDeleting = false;
      delay = 800;
    }

    setTimeout(() => this.typeEffect(), delay);
  }

  ngOnDestroy(): void {
    if (this.carouselInterval) {
      clearInterval(this.carouselInterval);
    }
  }

  /* CAROUSEL LOGIC */
  startCarousel(): void {
  if (this.carouselInterval) clearInterval(this.carouselInterval);
  this.currentIndex = 0;

  this.carouselInterval = setInterval(() => {
    this.currentIndex = (this.currentIndex + 1) % this.images.length;
  }, 8000);
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
        console.error('Error fetching blog feed:', err);
        this.error = true;
        this.loading = false;
      }
    });
  }

  openPost(url: string): void {
    window.open(url, '_blank');
  }

  /* CATEGORY NAVIGATION USED IN TEMPLATE */
  openCategory(slug: string): void {
    this.router.navigate(['/category', slug]);
  }

  goToProjects(): void {
    this.router.navigate(['/projects']);
  }
}
