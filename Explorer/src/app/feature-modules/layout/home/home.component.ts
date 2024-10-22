import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'xp-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  images: string[] = [
    'assets/images/tour1.jpg',
    'assets/images/tour2.jpg',
    'assets/images/tour3.jpg'
  ];
  currentImageIndex: number = 0;

  tours = [
    { name: 'Tour 1', description: 'Explore the mountains.', rating: 8.5, reviews: 'Very good, 235 reviews', imageUrl: 'assets/images/tour1.jpg' },
    { name: 'Tour 2', description: 'Explore the desert', rating: 9.0, reviews: 'Excellent, 150 reviews', imageUrl: 'assets/images/tour2.jpg' },
    { name: 'Tour 3', description: 'Discover the city.', rating: 7.5, reviews: 'Good, 100 reviews', imageUrl: 'assets/images/tour3.jpg' },
    { name: 'Tour 4', description: 'Experience the jungle.', rating: 8.0, reviews: 'Very good, 180 reviews', imageUrl: 'assets/images/tour1.jpg' },
    { name: 'Tour 5', description: 'Relax at the beach.', rating: 7.5, reviews: 'Good, 100 reviews', imageUrl: 'assets/images/tour2.jpg' },
    { name: 'Tour 6', description: 'Experience the jungle.', rating: 8.0, reviews: 'Very good, 180 reviews', imageUrl: 'assets/images/tour3.jpg' }
  ];

  ngOnInit() {
    this.startImageRotation();
  }

  startImageRotation() {
    setInterval(() => {
      this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
    }, 10000);
  }

  ngAfterViewInit() {
    const container = document.querySelector('.tour-cards-container') as HTMLElement;

    let isDown = false;
    let startX: number;
    let scrollLeft: number;

    container.addEventListener('mousedown', (e) => {
      isDown = true;
      container.classList.add('active');
      startX = e.pageX - container.offsetLeft;
      scrollLeft = container.scrollLeft;
    });

    container.addEventListener('mouseleave', () => {
      isDown = false;
      container.classList.remove('active');
    });

    container.addEventListener('mouseup', () => {
      isDown = false;
      container.classList.remove('active');
    });

    container.addEventListener('mousemove', (e) => {
      if (!isDown) return;
      e.preventDefault();
      const x = e.pageX - container.offsetLeft;
      const walk = (x - startX) * 2; // Scroll-fast
      container.scrollLeft = scrollLeft - walk;
    });
  }

}
