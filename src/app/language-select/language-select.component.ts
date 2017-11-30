import {Component} from '@angular/core';
import {ProjectService} from '../service/project.service';

@Component({
  selector: 'epamghio-language-select',
  templateUrl: './language-select.component.html',
  styleUrls: ['./language-select.component.css']
})
export class LanguageSelectComponent {
  ANY_VALUE = 'Any';
  public items: Array<any> = [
    this.ANY_VALUE,
    'Java', 'C', 'C++', 'Objective-C',
    'Ruby', 'Python', 'Javascript', 'Html',
    'CSS', 'Typescript', 'C#', 'Erlang'
  ];

  private value: any = {id: this.ANY_VALUE, text: this.ANY_VALUE};

  constructor(private projectService: ProjectService) {

  }

  public selected(value: any): void {
    this.projectService.searchEvent.emit({language: value.id === this.ANY_VALUE ? '' : value.id});
  }

  public refreshValue(value: any): void {
    this.value = value;
  }
}
