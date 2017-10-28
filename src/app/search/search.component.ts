import {Component, OnInit} from '@angular/core';
import {FormControl} from '@angular/forms';
import {ProjectService} from '../service/project.service';

@Component({
  selector: 'epamghio-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css']
})
export class SearchComponent implements OnInit {
  searchInput: FormControl = new FormControl('');

  constructor(private projectService: ProjectService) {
  }

  ngOnInit() {
    this.searchInput.valueChanges
      .debounceTime(500)
      .subscribe(value => this.projectService.searchEvent.emit({filter: value}));
  }
}
