import {Component, inject} from '@angular/core';
import { RouterOutlet } from '@angular/router';
import {UserListComponentComponent} from './user-list-component/user-list-component.component';
import {HttpClient} from '@angular/common/http';
import {UserDetailsComponent} from './user-details/user-details.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, UserListComponentComponent, UserDetailsComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.scss'
})
export class AppComponent {
  title = 'untitled7';

}
