import { Component, OnInit } from '@angular/core';
import { CourseComponent } from '../course/course.component';
import { environment } from './../../environments/environment';

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

  num_courses = 1;

  constructNewCourse(): any {
    return {"number": this.num_courses++, "min_bid": 0, "max_bid": 100, "credits": 0.5, "affinity": 1}
  }

  courses = [
    this.constructNewCourse()
  ]

  constructor() { }

  ngOnInit(): void {
  }

  addNewCourse(): void {
    this.courses.push(
      this.constructNewCourse()
    )
  }

  getOptimalBids(): void {
    // Construct query to backend GCP function and display result

    fetch(environment.backend_optimize_endpoint + "optimize-course-bids/" + encodeURIComponent(JSON.stringify(
        {
          "bid_points": 200,
          "courses_to_bid_on": this.courses.length,
          "required_courses": [],
          "courses": this.courses
      }

      ))).then(response => response.json())
      .then(data => console.log(data));
  }

  minBidSet(bid: string): void {
    var course_num = Number(bid.split('-')[0]);
    var value = Number(bid.split("-")[1]);
    this.courses[course_num - 1].min_bid = value;
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
