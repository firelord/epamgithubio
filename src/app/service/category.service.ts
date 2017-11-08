import {Injectable} from '@angular/core';

@Injectable()
export class CategoryService {
  categories = {
    1: 'BigData & Cloud',
    2: 'Life Science',
    3: 'Testing & Development',
    4: 'Misc'
  };

  private projectNameToCategories = {
    'DLab': 1,
    'Lagerta': 1,
    'NGB': 2,
    'Indigo': 2,
    'indigo-node': 2,
    'ketcher': 2,
    'miew': 2,
    'lifescience': 2,
    'pipeline-builder': 2,
    'JDI': 3,
    'JDI-Examples': 3,
    'Merlin': 3,
    'Wilma': 3,
    'Gepard': 3,
    'lib-obj-c-attr': 4,
    'OneDrive-L': 4,
    'java-cme-mdp3-handler': 4,
    'parso': 4,
    'htsjdk-s3-plugin': 4,
    'Sitecore-Reference-Storefront-on-Habitat': 4,
    'libdt': 4,
    'Constellation': 4,
    'road-ios-framework': 4,
    'road-ios-logging': 4,
    'nfstrace': 4,
    'Rapier': 4,
    'xframework': 4
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
