import {Component} from '@angular/core';
import {ProjectService} from "../service/project.service";

@Component({
  selector: 'epamghio-language-select',
  templateUrl: './language-select.component.html',
  styleUrls: ['./language-select.component.css']
})
export class LanguageSelectComponent {
  public items: Array<any> = [
    'Any',
    'Java', 'C', 'C++', 'Objective-C',
    'Ruby', 'Python', 'Javascript', 'Html',
    'CSS', 'Typescript', 'C#', 'Erlang'
  ];

  private value: any = {};

  constructor(private projectService: ProjectService) {

  }

  public selected(value: any): void {
    console.log(value);
    this.projectService.searchEvent.emit({language: value.id});
  }

  public refreshValue(value: any): void {
    this.value = value;
  }
}
