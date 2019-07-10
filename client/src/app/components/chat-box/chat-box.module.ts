import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ToastrModule } from 'ngx-toastr';
import { RouterModule } from '@angular/router';
import { ChatBoxComponent } from './chat-box.component';
import { SharedModule } from 'src/app/shared/shared.module';
import { UserDetailsComponent } from 'src/app/shared/user-details/user-details.component';
import { FirstCharComponent } from 'src/app/shared/first-char/first-char.component';



@NgModule({
  declarations: [ChatBoxComponent],
  imports: [
    CommonModule,
    BrowserAnimationsModule,
    UserDetailsComponent,
    FirstCharComponent,
     ToastrModule.forRoot(),
    RouterModule.forChild([
      {path: 'chat', component: ChatBoxComponent}
    ]),
    SharedModule
  ],

})
export class ChatBoxModule { }
