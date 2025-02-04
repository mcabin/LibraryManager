import { Routes } from '@angular/router';
import { LogPageComponent } from './components/auth/log-page/log-page.component';
import { RegisterPageComponent } from './components/auth/register-page/register-page.component';
import { HomePageComponent } from './components/home-page/home-page.component';
import { BookCardComponent } from './components/book/book-card/book-card.component';
import { BookListComponent } from './components/book/book-list/book-list.component';
import { BookPageComponent } from './components/book/book-page/book-page.component';

export const routes: Routes = [
    {path: 'login',component: LogPageComponent},
    {path: 'register',component: RegisterPageComponent},
    {path: 'homepage',component: HomePageComponent},
    {path: 'card',component: BookCardComponent},
    {path: 'search',component:BookListComponent},
    {path: 'book/:id',component:BookPageComponent},
    {path: '',redirectTo:'homepage',pathMatch:'full'},
    {path: '**',redirectTo:'homepage'},
];
