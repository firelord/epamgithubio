import {Component, OnInit} from '@angular/core';
import 'rxjs/add/operator/findIndex';
import 'rxjs/add/operator/concat';
import 'rxjs/add/operator/take';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  constructor() {
  }

  ngOnInit(): void {
  }
}
