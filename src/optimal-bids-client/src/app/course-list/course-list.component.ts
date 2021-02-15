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
        (mandatorySet)="mandatorySet($event)"
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

    <mat-form-field class="bidPointsSetting">
      <mat-label class="bidPointlabel">Courses needed to graduate</mat-label>
      <input type="number" step=1 [(ngModel)]="credits_to_bid_on" matInput>
    </mat-form-field>
  </div>
  `
})

export class CourseListComponent implements OnInit {

  num_courses = 1;
  bid_points_to_give = 200;
  credits_to_bid_on = 1;

  constructNewCourse(): any {
    return {"number": this.num_courses++, "bid_points": "__", "min_bid": 0, "max_bid": 100, "credits": 0.5, "affinity": 1, "mandatory": false}
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
        this.courses[Number(i)].bid_points = x.result[i];
      }
    }
    var required_courses = [];
    for(var i = 0; i < this.courses.length; i++) {
      if(this.courses[i].mandatory == true) {
        required_courses.push(i);
      }
    }
    fetch(environment.backend_optimize_endpoint + "?query_params=" + encodeURIComponent(JSON.stringify(
        {
          "bid_points": this.bid_points_to_give,
          "courses_to_bid_on": this.credits_to_bid_on,
          "required_courses": required_courses,
          "courses": this.courses
      }

      ))).then(response => 
        response.json())
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

  mandatorySet(mandatory: string): void {
    var course_num = Number(mandatory.split('-')[0]);
    var value = (mandatory.split("-")[1]) == "false"? false : true;
    console.log("Setting course ", course_num, " mandatory status to ", value);
    this.courses[course_num - 1].mandatory = value;
  }
}
