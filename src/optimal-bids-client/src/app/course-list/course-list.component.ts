import { Component, OnInit } from '@angular/core';
import { CourseComponent } from '../course/course.component';

@Component({
  selector: 'app-course-list',
  styleUrls: ['./course-list.component.css'],
  template: 
  `
  <ul>
    <li *ngFor="let course of courses" >
      <app-course course_number={{course.number}}></app-course>
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

  }
}
