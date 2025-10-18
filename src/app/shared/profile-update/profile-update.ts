import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ProfileUpdateService } from '../../core/services/profile-update.service';
import { UpdateUser } from './profile-update.model';

@Component({
  selector: 'app-profile-update',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './profile-update.html',
  styleUrls: ['./profile-update.css']
})
export class ProfileUpdateComponent {
  user: UpdateUser = {
    fullName: '',
    dob: '',
    phoneNo: '',
    email:''
  };

  constructor(private profileUpdateService: ProfileUpdateService) {}

  updateUser() {
    this.profileUpdateService.updateUser(this.user).subscribe({
      next: (response) => {
        console.log('User updated successfully', response);
      },
      error: (error) => {
        console.error('Error updating user', error);
      }
    });
  }
}