import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'xp-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  images: string[] = [
    'assets/images/tour3.jpg',
    'assets/images/tour6.jpg',
    'assets/images/tour8.jpg'  
  ]; 
  currentImageIndex: number = 0;
  isTransitioning = false;

  tours = [
    { name: 'Lorem Ipsum', description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. ', rating: 8.5, reviews: 'Very good, 235 reviews', imageUrl: 'assets/images/tour4.jpg' },
    { name: 'Lorem Ipsum', description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. ', rating: 9.2, reviews: 'Excellent, 150 reviews', imageUrl: 'assets/images/tour5.jpg' },
    { name: 'Lorem Ipsum', description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. ', rating: 7.5, reviews: 'Good, 100 reviews', imageUrl: 'assets/images/tour6.jpg' },
    { name: 'Lorem Ipsum', description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. ', rating: 8.1, reviews: 'Very good, 180 reviews', imageUrl: 'assets/images/tour7.jpg' },
    { name: 'Lorem Ipsum', description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. ', rating: 7.5, reviews: 'Good, 100 reviews', imageUrl: 'assets/images/tour8.jpg' },
    { name: 'Lorem Ipsum', description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. ', rating: 8.3, reviews: 'Very good, 180 reviews', imageUrl: 'assets/images/tour9.jpg' }
  ];

  clubs = [
    { name: 'Lorem Ipsum', description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. ', rating: 8.5, reviews: 'Very good, 235 reviews', imageUrl: 'assets/images/club1.jpg' },
    { name: 'Lorem Ipsum', description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. ', rating: 9.2, reviews: 'Excellent, 150 reviews', imageUrl: 'assets/images/club2.jpg' },
    { name: 'Lorem Ipsum', description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. ', rating: 7.5, reviews: 'Good, 100 reviews', imageUrl: 'assets/images/club3.jpg' },
    { name: 'Lorem Ipsum', description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. ', rating: 8.1, reviews: 'Very good, 180 reviews', imageUrl: 'assets/images/club4.jpg' },
    { name: 'Lorem Ipsum', description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. ', rating: 7.5, reviews: 'Good, 100 reviews', imageUrl: 'assets/images/club5.jpg' },
    { name: 'Lorem Ipsum', description: 'Lorem Ipsum is simply dummy text of the printing and typesetting industry. ', rating: 8.3, reviews: 'Very good, 180 reviews', imageUrl: 'assets/images/club6.jpg' }
  ];

  ngOnInit() {
    this.startImageRotation();
  }

  ngAfterViewInit() {
    const tourContainer = document.querySelector('.tour-cards-container') as HTMLElement;
    const clubContainer = document.querySelector('.club-cards-container') as HTMLElement;

    // Scrolling for the tours container
    this.setupScrolling(tourContainer);

    // Scrolling for the clubs container
    this.setupScrolling(clubContainer);
  }

  startImageRotation() {
    setInterval(() => {
      if (!this.isTransitioning) {
        this.isTransitioning = true;
        setTimeout(() => {
          this.currentImageIndex = (this.currentImageIndex + 1) % this.images.length;
          this.isTransitioning = false;
        }, 1000); 
      }
    }, 7000);
  }

  // Helper function to setup scrolling for a container
  setupScrolling(container: HTMLElement) {
    container.addEventListener('wheel', (e) => {
        e.preventDefault(); 
        container.scrollLeft += e.deltaY; 
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
        const walk = (x - startX) * 2; 
        container.scrollLeft = scrollLeft - walk;
    });
  }
}
