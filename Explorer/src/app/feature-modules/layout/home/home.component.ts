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
    { name: 'Lorem Ipsum', description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. ', rating: 8.5, reviews: 'Very good, 235 reviews', imageUrl: 'assets/images/tour4.jpg' },
    { name: 'Lorem Ipsum', description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. ', rating: 9.2, reviews: 'Excellent, 150 reviews', imageUrl: 'assets/images/tour5.jpg' },
    { name: 'Lorem Ipsum', description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. ', rating: 7.5, reviews: 'Good, 100 reviews', imageUrl: 'assets/images/tour6.jpg' },
    { name: 'Lorem Ipsum', description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. ', rating: 8.1, reviews: 'Very good, 180 reviews', imageUrl: 'assets/images/tour7.jpg' },
    { name: 'Lorem Ipsum', description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. ', rating: 7.5, reviews: 'Good, 100 reviews', imageUrl: 'assets/images/tour8.jpg' },
    { name: 'Lorem Ipsum', description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. ', rating: 8.3, reviews: 'Very good, 180 reviews', imageUrl: 'assets/images/tour9.jpg' }
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

    // Add event listener for mouse wheel scrolling
    container.addEventListener('wheel', (e) => {
      e.preventDefault(); // Prevent the default vertical scroll behavior
      container.scrollLeft += e.deltaY; // Scroll horizontally based on vertical scroll
    });

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
