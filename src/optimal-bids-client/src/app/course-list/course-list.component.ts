import { Component, OnInit } from '@angular/core';
import { CourseComponent } from '../course/course.component';

@Component({
  selector: 'app-course-list',
  styleUrls: ['./course-list.component.css'],
  template: 
  `
  <ul>
    <li *ngFor="let course of courses" >
      <app-course course_number={{course.number}} class="app-course"
        (minBidSet)="minBidSet($event)"
        (maxBidSet)="maxBidSet($event)"
        (creditsSet)="creditsSet($event)"
        (affinitySet)="affinitySet($event)"
      >
      
      </app-course>
    </li>
  </ul>

  <div> 
  

  <div class="flex-container">
    <button (click)=addNewCourse()> Add new course </button>
    <button class="calcButton" (click)=getOptimalBids()> Calculate Optimal Bids </button>
  </div>
  `
})

export class CourseListComponent implements OnInit {
  courses = [
    {"number": 1}
  ]
  constructor() { }

  ngOnInit(): void {
  }

  addNewCourse(): void {
    this.courses.push(
      { "number": this.courses[this.courses.length - 1].number+1 }
    )
  }

  getOptimalBids(): void {
    var courses = document.querySelectorAll(".app-course");
    courses.forEach(course => {
      // Min bid
      var minBid = course.children[0].children[1].children[0].children[0].children[0].children[0].nodeValue;
      console.log(minBid);
    });
  }

  minBidSet(bid: string): void {
    console.log(bid);
  }

  maxBidSet(bid: string): void {
    console.log(bid);
  }

  creditsSet(credits: string): void {
    console.log(credits);
  }

  affinitySet(affinity: string): void {
    console.log(affinity);
  }
}
