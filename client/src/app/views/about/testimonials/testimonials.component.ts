import { Component } from '@angular/core';

interface Testimonial {
  id: number;
  name: string;
  role: string;
  image: string;
  content: string;
}

@Component({
  selector: 'app-testimonials',
  templateUrl: './testimonials.component.html',
  styleUrls: ['./testimonials.component.scss']
})
export class TestimonialsComponent {
  testimonials: Testimonial[] = [
    {
      id: 1,
      name: 'John Doe',
      role: 'Homeowner – Machakos',
      image: 'assets/images/Story1.jfif',
      content: 'Domysuma Architects delivered a beautiful and functional house plan for my rural home. The team listened closely to what I wanted and designed a space that fits my family perfectly.'
    },
    {
      id: 2,
      name: 'Jane Doe',
      role: 'Property Developer – Nairobi',
      image: 'assets/images/Story2.jfif',
      content: 'Working with Domysuma was seamless. They handled approvals, drawings, and supervision professionally. My project stayed on schedule and the final finish exceeded my expectations.'
    },
    {
      id: 3,
      name: 'John Doe',
      role: 'Business Owner – Kisumu',
      image: 'assets/images/Story1.jfif',
      content: 'They designed my commercial space with excellent attention to detail. The layout maximizes natural light and customer flow. I constantly get compliments from clients.'
    },
    {
      id: 4,
      name: 'Jane Doe',
      role: 'Real Estate Investor – Kitengela',
      image: 'assets/images/Story2.jfif',
      content: 'Domysuma helped me refine my apartment concept and provided high-quality drawings. The professionalism and speed of delivery were outstanding.'
    },
    {
      id: 5,
      name: 'John Doe',
      role: 'Homeowner – Thika',
      image: 'assets/images/Story1.jfif',
      content: 'From initial sketches to the final plan, the team was patient and precise. They turned my ideas into a beautiful, modern design that fits my budget.'
    },
    {
      id: 6,
      name: 'Jane Doe',
      role: 'Construction Contractor – Eldoret',
      image: 'assets/images/Story2.jfif',
      content: 'Their drawings are clear, accurate, and easy to work with on-site. This has saved us a lot of time during construction. Highly reliable team.'
    },
    {
      id: 7,
      name: 'John Doe',
      role: 'Interior Design Client – Nairobi',
      image: 'assets/images/Story1.jfif',
      content: 'The interior concepts they produced for my apartment were stunning. Every space feels intentional and well thought-out. I would work with them again anytime.'
    },
    {
      id: 8,
      name: 'Jane Doe',
      role: 'Office Renovation Client – Westlands',
      image: 'assets/images/Story2.jfif',
      content: 'Domysuma redesigned our office to feel modern and efficient. Our staff love the new layout, and productivity has noticeably improved.'
    }
  ];
}
