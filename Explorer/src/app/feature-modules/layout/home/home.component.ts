import { Component } from '@angular/core';

@Component({
  selector: 'xp-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent {
  tours = [
    { name: 'Tour 1', description: 'Description of Tour 1', rating: 8.5, reviews: 'Very good, 235 reviews' },
    { name: 'Tour 2', description: 'Description of Tour 2', rating: 9.0, reviews: 'Excellent, 150 reviews' },
    { name: 'Tour 3', description: 'Description of Tour 3', rating: 7.5, reviews: 'Good, 100 reviews' },
    { name: 'Tour 4', description: 'Description of Tour 4', rating: 8.0, reviews: 'Very good, 180 reviews' },
    { name: 'Tour 5', description: 'Description of Tour 5', rating: 9.2, reviews: 'Outstanding, 300 reviews' }
  ];

  scrollLeft() {
    const container = document.querySelector('.tour-cards') as HTMLElement;
    container.scrollBy({ left: -300, behavior: 'smooth' });
  }

  scrollRight() {
    const container = document.querySelector('.tour-cards') as HTMLElement;
    container.scrollBy({ left: 300, behavior: 'smooth' });
  }
}
