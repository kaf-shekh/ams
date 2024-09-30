import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { NotFoundComponent } from './pages/not-found/not-found.component';
import { LoginComponent } from './pages/login/login.component';
import { AuthGuard } from './core/auth/auth.guard';

const routes: Routes = [
  {
    path: '', loadChildren: () => import("./pages/home/home.module").then((m) => m.HomeModule), canActivate: [AuthGuard] 
  },
  {
    path: 'login', component: LoginComponent
  },
  {
    path: '**', component: NotFoundComponent
  }

];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }

