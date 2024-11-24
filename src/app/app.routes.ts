import { Routes } from '@angular/router';
import {UserListComponentComponent} from './user-list-component/user-list-component.component';
import {UserDetailsComponent} from './user-details/user-details.component';

export const routes: Routes = [
  { path: '', component: UserDetailsComponent }, // Default route for the user list
  { path: 'user', component: UserListComponentComponent }, // Route for user details;
];

