import { Component, OnInit } from '@angular/core';
import { CourseComponent } from '../course/course.component';
import { environment } from './../../environments/environment';

@Component({
  selector: 'app-course-list',
  styleUrls: ['./course-list.component.css'],
  template: 
  `
    <div class="courseContainer" *ngFor="let course of courses" >
      <app-course course_number={{course.number}} bid_points={{course.bid_points}} class="app-course"
        (minBidSet)="minBidSet($event)"
        (maxBidSet)="maxBidSet($event)"
        (creditsSet)="creditsSet($event)"
        (affinitySet)="affinitySet($event)"
      >
      
      </app-course>
    </div>

  <div> 
  

  <div class="bottomButtons">
    <button mat-raised-button class="calcButton" (click)=addNewCourse()> Add new course </button>
    <button mat-raised-button class="calcButton" (click)=getOptimalBids()> Calculate optimal bids </button>
    <mat-form-field class="bidPointsSetting">
      <mat-label class="bidPointlabel">Available bid points</mat-label>
      <input type="number" [(ngModel)]="bid_points_to_give" matInput>
    </mat-form-field>
  </div>
  `
})

export class CourseListComponent implements OnInit {

  num_courses = 1;
  bid_points_to_give = 200;

  constructNewCourse(): any {
    return {"number": this.num_courses++, "bid_points": "__", "min_bid": 0, "max_bid": 100, "credits": 0.5, "affinity": 1}
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

    let display_res = (x: any): void => {
      console.log(x);
      for(var i = 0; i < this.courses.length; i++) {
        console.log(this.courses[Number(i)].bid_points);
        this.courses[Number(i)].bid_points = x.result[i];
      }
    }
    fetch(environment.backend_optimize_endpoint + "optimize-course-bids/" + encodeURIComponent(JSON.stringify(
        {
          "bid_points": this.bid_points_to_give,
          "courses_to_bid_on": this.courses.length,
          "required_courses": [],
          "courses": this.courses
      }

      ))).then(response => response.json())
      .then(data => {
        display_res(data);
      });
  }

  minBidSet(bid: string): void {
    var course_num = Number(bid.split('-')[0]);
    var value = Number(bid.split("-")[1]);
    this.courses[course_num - 1].min_bid = value;
  }

  maxBidSet(bid: string): void {
    var course_num = Number(bid.split('-')[0]);
    var value = Number(bid.split("-")[1]);
    this.courses[course_num - 1].max_bid = value;
  }

  creditsSet(credits: string): void {
    var course_num = Number(credits.split('-')[0]);
    var value = Number(credits.split("-")[1]);
    this.courses[course_num - 1].credits = value;
  }

  affinitySet(affinity: string): void {
    var course_num = Number(affinity.split('-')[0]);
    var value = Number(affinity.split("-")[1]);
    this.courses[course_num - 1].affinity = value;
  }
}
