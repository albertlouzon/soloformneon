import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';

import { AppComponent } from './app.component';
import { NeonFormComponent } from './neon-form/neon-form.component';
import { HttpClientModule } from '@angular/common/http';
import { ArchwizardModule } from 'angular-archwizard';
import {FormsModule} from '@angular/forms';
import {AutosizeModule} from 'ngx-autosize';

@NgModule({
  declarations: [
    AppComponent,
    NeonFormComponent
  ],
  imports: [
    BrowserModule,
    HttpClientModule,
    ArchwizardModule,
    FormsModule,
    AutosizeModule

  ],
  entryComponents: [NeonFormComponent],
  providers: [ArchwizardModule],
  bootstrap: [AppComponent]
})
export class AppModule { }
