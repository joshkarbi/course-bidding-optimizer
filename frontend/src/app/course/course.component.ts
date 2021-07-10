import { Component, Input, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-course',
  templateUrl: './course.component.html',
  styleUrls: ['./course.component.css']
})
export class CourseComponent implements OnInit {
  @Input() course_number: string = "";
  @Input() bid_points: string="__";

  minBid: number = 1;
  maxBid: number = 100;
  credits: number = 0.5;
  affinity: number = 1;
  mandatory: boolean = false;

  @Output() minBidSet = new EventEmitter<string>();
  @Output() maxBidSet = new EventEmitter<string>();
  @Output() creditsSet = new EventEmitter<string>();
  @Output() affinitySet = new EventEmitter<string>();
  @Output() mandatorySet = new EventEmitter<string>();

  constructor() { }

  ngOnInit(): void {
  }

  formatLabel(value: number) {
    if (value >= 1000) {
      return Math.round(value / 1000) + 'k';
    }

    return value;
  }

  // Capture events from child courses - setting the parameters
  // Events come back as strings course_number-value
  minBidChanged(): void {
    this.minBidSet.emit(String(this.course_number)+"-"+String(this.minBid));
  }
  maxBidChanged(): void {
    this.maxBidSet.emit(String(this.course_number)+"-"+String(this.maxBid));
  }
  creditsChanged(): void {
    this.creditsSet.emit(String(this.course_number)+"-"+String(this.credits));
  }
  affinityChanged(): void {
    this.affinitySet.emit(String(this.course_number)+"-"+String(this.affinity));
  }
  requiredChanged(event: any): void {
    var label = event.checked==true ? "true":"false"; 
    this.mandatorySet.emit(String(this.course_number)+"-"+label);
  }
}
