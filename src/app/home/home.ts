import { Component ,OnInit, OnDestroy } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { trigger, transition, style, animate, animateChild } from '@angular/animations';
import { MatExpansionModule } from '@angular/material/expansion';

// Define the new animation helpers
const enterTransition = transition(':enter', [
  style({ transform: 'translateX(100%)', opacity: 0 }),
  animate('400ms ease-out', style({ transform: 'translateX(0%)', opacity: 1 })),
]);

const leaveTransition = transition(':leave', [
  style({ transform: 'translateX(0%)', opacity: 1 }),
  animate('400ms ease-out', style({ transform: 'translateX(-100%)', opacity: 0 }))
]);

const fadeSlide = trigger('fadeSlide', [
  enterTransition,
  leaveTransition
]);

@Component({
  selector: 'app-home',
  imports: [MatIconModule ,MatButtonModule,MatExpansionModule  ],
  animations: [ fadeSlide ],
  templateUrl: './home.html',
  styleUrl: './home.css'
})
export class Home implements OnInit, OnDestroy{

  selectedIndex: number = 0;
  carouselInterval: any; 

  carouselItems = [
    {
      image: 'assets/carousel-images/carousel-1.png',
      tag: 'EXAM SETUP',
      title: 'Create exams in minutes',
      description: 'Set up exams, add questions, and organize topics quickly. Simple for examiners and admins.',
      buttonText: 'Start now'
    },
    {
      image: 'assets/carousel-images/carousel-2.png',
      tag: 'USER ACCESS',
      title: 'Easy user management',
      description: 'Add students, approve exams, and keep everything organized. Manage access with ease.',
      buttonText: 'Manage users'
    },
    {
      image: 'assets/carousel-images/carousel-3.png',
      tag: 'RESULTS & FEEDBACK',
      title: 'See progress instantly',
      description: 'View results, feedback, and trends at a glance. Make decisions with clear data.',
      buttonText: 'View data'
    },
    {
      image: 'assets/carousel-images/carousel-4.png',
      tag: 'REPORTING',
      title: 'Detailed insights',
      description: 'Generate comprehensive reports on performance, questions, and user activity.',
      buttonText: 'Get reports'
    }
  ];

  ngOnInit(): void {
    this.startCarousel();
  }

  ngOnDestroy(): void {
    // Clear the interval when the component is destroyed to prevent memory leaks
    clearInterval(this.carouselInterval);
  }

  startCarousel(): void {
    this.carouselInterval = setInterval(() => {
      this.nextItem();
    }, 4000); // Change item every 4 seconds (4000 milliseconds)
  }

  // Function to navigate to the previous item (now with looping)
  prevItem(): void {
    this.selectedIndex = (this.selectedIndex > 0)
      ? this.selectedIndex - 1
      : this.carouselItems.length - 1;
  }

  // Function to navigate to the next item (now with looping)
  nextItem(): void {
    this.selectedIndex = (this.selectedIndex < this.carouselItems.length - 1)
      ? this.selectedIndex + 1
      : 0;
  }
}
