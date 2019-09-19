import { BrowserAnimationsModule } from "@angular/platform-browser/animations";
import { NgModule } from "@angular/core";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { HttpModule } from "@angular/http";
import { BrowserModule } from "@angular/platform-browser";

import { HttpClientModule } from "@angular/common/http";
import { RouterModule } from "@angular/router";
import {
  MatButtonModule,
  MatInputModule,
  MatRippleModule,
  MatTooltipModule,
  MatIconModule,
  MatSlideToggleModule,
  MatProgressSpinnerModule,
  MatDatepickerModule,
  MatNativeDateModule,
  MatListModule,
  MatDividerModule,
} from "@angular/material";

import { AppRoutingModule } from "./app.routing";
import { ComponentsModule } from "./components/components.module";

import { AppComponent } from "./app.component";
import { AgmCoreModule } from "@agm/core";
import { AdminLayoutComponent } from "./layouts/admin-layout/admin-layout.component";
import { LoginComponent } from "./login/login.component";
import { AuthGuard } from "./auth.guard";
import { Ng2Webstorage } from "ngx-webstorage";
import { ClassListComponent } from './class-list/class-list.component';
import { ViewExamComponent } from './view-exam/view-exam.component';
import { CKEditorModule } from '@ckeditor/ckeditor5-angular';
import { VideosComponent } from './videos/videos.component';

@NgModule({
  imports: [
    BrowserModule,
    BrowserAnimationsModule,
    FormsModule,
    ReactiveFormsModule,
    HttpModule,
    HttpClientModule,
    ComponentsModule,
    RouterModule,
    AppRoutingModule,
    MatButtonModule,
    MatRippleModule,
    MatInputModule,
    MatTooltipModule,
    MatIconModule,
    MatSlideToggleModule,
    MatListModule,
    MatDividerModule,
    MatProgressSpinnerModule,
    MatDatepickerModule,
    MatNativeDateModule,
    CKEditorModule,
    // AgmCoreModule.forRoot({
    //   apiKey: 'YOUR_GOOGLE_MAPS_API_KEY'
    // })
    Ng2Webstorage
    // NgxWebstorageModule
  ],

  declarations: [
    AppComponent,
    AdminLayoutComponent,
    LoginComponent,
    ViewExamComponent,
    VideosComponent,
  ],
  exports: [],
  providers: [AuthGuard],
  bootstrap: [AppComponent]
})
export class AppModule {}
