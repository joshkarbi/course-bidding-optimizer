import { Component, Input, OnInit, Output } from '@angular/core';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {
  @Input() course_number: string = "";
  credits: number = 0.5;
  
  constructor() { }

  ngOnInit(): void {
  }

  formatLabel(value: number) {
    console.log(this.credits);
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }

    return value;
  }
}
