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
      name: 'Glory Joash',
      role: 'Satisfied Customer',
      image: 'assets/images/gInitial.jpg', //G Google initials
      content: 'Creativity and value for money. I`m impressed with their work.'
    },
    {
      id: 2,
      name: 'Nyanduaki',
      role: 'Satisfied Customer',
      image: 'assets/images/nInitial.png', //N Google initials
      content: 'Trusted. Reliable and creative! Would greatly recommend.'
    },
    {
      id: 3,
      name: 'Violet Kerubo',
      role: 'Satisfied Customer',
      image: 'assets/images/vInitial.jpg', //V Google initials
      content: 'Dependable, responsive, quality workmanship and dedication to getting the project completed timely and on or under budget. They treated our home as if it was their own. I would not hesitate to recommend it to my family and friends. They are definitely the best.'
    },
    {
      id: 4,
      name: 'Selina Syombua',
      role: 'Satisfied Customer',
      image: 'assets/images/sInitial.jpg', //S initials 
      content: 'The best and loveable modern green architect company in Nairobi. It`s super reliable.'
    },
    {
      id: 5,
      name: 'Black Fire',
      role: 'Satisfied Customer',
      image: 'assets/images/bInitial.png', //B initials
      content: 'They take you keenly through the design process from the conceptual stage to the final product, 100% would recommend them.'
    },
    {
      id: 6,
      name: 'Samuel Kamau',
      role: 'Satisfied Customer',
      image: 'assets/images/sInitial.jpg', //S initials
      content: 'They are really amazing and they know what they are doing I love there designs and delivery. Thank you Domysuma.'
    },
    {
      id: 7,
      name: 'Vincent Roddy',
      role: 'Satisfied Customer',
      image: 'assets/images/vInitial.jpg', //V initials
      content: 'It has good designs. Explains arevery thorough hence one understands very well what he wants. The employees are fiendly and they make sure you are fully satisfied. '
    },
    {
      id: 8,
      name: 'Dan Muhoro Gaks',
      role: 'Satisfied Customer',
      image: 'assets/images/dInitial.png',// D initials
      content: 'They are so professional and at the same time good at their work. It`s the right place to go if you`re looking forward to professional and superb work.'
    }
  ];
}
