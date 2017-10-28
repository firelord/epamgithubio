import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {NavbarComponent} from './navbar/navbar.component';
import {HttpModule} from '@angular/http';
import {Ng2Webstorage} from 'ng2-webstorage';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { FooterComponent } from './footer/footer.component';
import { AboutComponent } from './about/about.component';
import { ProjectsComponent } from './projects/projects.component';
import { ProjectItemComponent } from './project-item/project-item.component';
import { SearchProjectComponent } from './search-project/search-project.component';
import {ProjectService} from './service/project.service';
import {RouterModule} from '@angular/router';
import { HeaderComponent } from './header/header.component';
import { SearchComponent } from './search/search.component';
import { CategoryBlockComponent } from './category-block/category-block.component';
import { MainMenuComponent } from './main-menu/main-menu.component';
import {CategoryService} from "./service/category.service";

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    AboutComponent,
    ProjectsComponent,
    ProjectItemComponent,
    SearchProjectComponent,
    HeaderComponent,
    SearchComponent,
    CategoryBlockComponent,
    MainMenuComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    RouterModule.forRoot([
      {path: '', redirectTo: 'repoList', pathMatch: 'prefix'},
      {path: 'repoList', component: AppComponent}
    ]),
    Ng2Webstorage.forRoot({prefix: 'epamghio', separator: '-'}),
    HttpModule
  ],
  providers: [ProjectService, CategoryService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
