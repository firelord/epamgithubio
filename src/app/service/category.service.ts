import {Injectable} from '@angular/core';

@Injectable()
export class CategoryService {
  categories = {
    1: 'Cloud Computing',
    2: 'Life Science',
    3: 'Testing & Development',
    4: 'Misc'
  };

  private projectNameToCategories = {
    'lib-obj-c-attr': 3,
    'road-ios-logging': 3,
    'java-cme-mdp3-handler': 3,
    'lifescience': 2
  };

  getCategory(projectName: string): string {
    return this.categories[this.projectNameToCategories[projectName] || 4];
  }

  relatesToCategory(name: string, category: number): boolean {
    if (category === 0)
      return true;

    return category === (this.projectNameToCategories[name] || 0);
  }
}
