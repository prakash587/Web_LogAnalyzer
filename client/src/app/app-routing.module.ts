import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import {SortByDateAndTimeComponent} from "./sort-by-date-and-time/sort-by-date-and-time.component";

const routes: Routes = [{
  path: '',
  component: SortByDateAndTimeComponent
},];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
