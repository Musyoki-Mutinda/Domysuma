export interface Project {
  id: string;
  category: string;
  title: string;
  gallery: string[];
  summary: string;
  description: string;
  specs: {
    duration: string;
    location: string;
    cost: string;
  };
  img: string;        // Thumbnail image for cards
  desc: string;       // Short description for cards
}
