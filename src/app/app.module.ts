import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {AppComponent} from './app.component';
import {NavbarComponent} from './navbar/navbar.component';
import {HttpModule} from '@angular/http';
import {Ng2Webstorage} from 'ng2-webstorage';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import { FooterComponent } from './footer/footer.component';
import { IntroHeaderComponent } from './intro-header/intro-header.component';
import { AboutComponent } from './about/about.component';
import { ProjectsComponent } from './projects/projects.component';
import { ProjectItemComponent } from './project-item/project-item.component';
import { SearchProjectComponent } from './search-project/search-project.component';
import {ProjectService} from './service/project.service';

@NgModule({
  declarations: [
    AppComponent,
    NavbarComponent,
    FooterComponent,
    IntroHeaderComponent,
    AboutComponent,
    ProjectsComponent,
    ProjectItemComponent,
    SearchProjectComponent
  ],
  imports: [
    BrowserModule,
    ReactiveFormsModule,
    FormsModule,
    BrowserAnimationsModule,
    Ng2Webstorage.forRoot({prefix: 'epamghio', separator: '-'}),
    HttpModule
  ],
  providers: [ProjectService],
  bootstrap: [AppComponent]
})
export class AppModule {
}
