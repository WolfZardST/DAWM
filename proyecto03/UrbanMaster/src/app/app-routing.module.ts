import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { ExploreComponent } from './views/explore/explore.component';

import { PickerComponent } from './views/picker/picker.component';
import { ScoresComponent } from './views/scores/scores.component';
import { SummaryComponent } from './views/summary/summary.component';

const routes: Routes = [
  {path: "picker", component: PickerComponent},
  {path: ":name", component: SummaryComponent},
  {path: ":name/statistics", component: ScoresComponent},
  {path: ":name/explore", component: ExploreComponent},
  { path: "**", redirectTo: "picker" }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
