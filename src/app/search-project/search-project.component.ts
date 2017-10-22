import { Component, OnInit } from '@angular/core';
import {FormControl} from '@angular/forms';
import {ProjectService} from '../service/project.service';
import {ProjectSearchRequest} from '../model/ProjectSearchRequest';
import 'rxjs/add/operator/do';
import 'rxjs/add/operator/debounceTime';

@Component({
  selector: 'epamghio-search-project',
  templateUrl: './search-project.component.html',
  styleUrls: ['./search-project.component.css']
})
export class SearchProjectComponent implements OnInit {
  searchInput: FormControl = new FormControl('');
  languageSelect: FormControl = new FormControl('');

  languages = [
    {name: 'Any Language', value: ''},
    {name: 'Java', value: 'java'},
    {name: 'JavaScript', value: 'javascript'},
    {name: 'C++', value: 'c++'},
    {name: 'C', value: 'c'},
    {name: 'Python', value: 'python'},
    {name: 'Html', value: 'html'},
    {name: 'Ruby', value: 'ruby'},
    {name: 'Objective-C', value: 'objective-c'},
    {name: 'Erlang', value: 'erlang'},
    {name: 'C#', value: 'c#'},
    {name: 'CSS', value: 'css'}
  ];

  constructor(private projectService: ProjectService) {
  }

  ngOnInit() {
    this.languageSelect.valueChanges
      .subscribe((value) => this.projectService.searchEvent.emit({language: value}));

    this.searchInput.valueChanges
      .debounceTime(500)
      .subscribe(value => this.projectService.searchEvent.emit({filt: value}));
  }
}
