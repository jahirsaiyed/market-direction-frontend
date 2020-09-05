import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AppComponent} from './app.component';
import { OptionsComponent } from './options/options.component';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';



const routes: Routes = [
  {path : 'watchlist', component : AppComponent},
  {path: 'options', component: OptionsComponent}
];

@NgModule({
  imports: [RouterModule.forRoot(routes), NgbModule],
  exports: [RouterModule]
})
export class AppRoutingModule { }
