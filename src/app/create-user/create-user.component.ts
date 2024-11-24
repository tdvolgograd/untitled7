import { Component, OnInit } from '@angular/core';
import { NgIf } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SharedStateService } from '../services/shared-state.service';
import { UserServiceService } from '../services/user-service.service';
import { UserDetail } from '../interfaces/user-detail';

@Component({
  selector: 'app-create-user',
  standalone: true,
  imports: [NgIf, ReactiveFormsModule],
  templateUrl: './create-user.component.html',
  styleUrls: ['./create-user.component.scss'],
})
export class CreateUserComponent implements OnInit {
  userDetailForm!: FormGroup;
  isLoading: boolean = false;
  isSuccess: boolean = false;

  constructor(
    private fb: FormBuilder,
    private sharedService: SharedStateService,
    private userService: UserServiceService
  ) {}

  ngOnInit(): void {
    this.userDetailForm = this.fb.group({
      id: [''],
      name: ['', Validators.required],
      username: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: [''],
      website: [''],
      address: this.fb.group({
        street: [''],
        suite: [''],
        city: [''],
        zipcode: [''],
        geo: this.fb.group({
          lat: [''],
          lng: [''],
        }),
      }),
      company: this.fb.group({
        name: [''],
        catchPhrase: [''],
        bs: [''],
      }),
    });
  }

  onSubmit(): void {
    if (this.userDetailForm.invalid) {
      return;
    }

    this.isLoading = true;
    const userDetail: UserDetail = this.userDetailForm.value;

    this.userService.createUser(userDetail).subscribe({
      next: () => {
        this.isLoading = false;
        this.isSuccess = true;
        this.userDetailForm.reset(); // Сброс формы по завершении
        console.log('Create user successful');
        this.toggleExit()
      },
      error: (error) => {
        this.isLoading = false;
        console.error('Error creating user:', error);
      },
    });
  }

  // Сброс формы по выходу
  toggleExit(): void {
    this.sharedService.setIsCreate(false);
    this.isSuccess = false;
    this.userDetailForm.reset();
  }
}
