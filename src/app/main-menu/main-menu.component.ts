import {Component, OnInit} from '@angular/core';
import {CategoryService} from '../service/category.service';
import {ProjectService} from "../service/project.service";

@Component({
  selector: 'epamghio-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.css']
})
export class MainMenuComponent implements OnInit {
  constructor(private categoryService: CategoryService,
              private projectService: ProjectService) {
  }

  activeCategory = 0;
  categories: { id, name }[];

  ngOnInit() {
    const categoriesObject = this.categoryService.categories;
    this.categories = Object
      .keys(categoriesObject)
      .map((key) => {
        return {id: key, name: categoriesObject[key]};
      });
  }

  chooseActiveCategory(event, categoryStr: string) {
    const category = parseInt(categoryStr, 10);
    console.log(typeof category);
    event.preventDefault();
    this.activeCategory = category;
    this.projectService.searchEvent.emit({category: category});
  }
}
