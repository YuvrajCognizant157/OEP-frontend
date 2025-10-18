import { Component } from '@angular/core';

import { AdminService } from '../../core/services/admin.service';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterOutlet } from "@angular/router";


@Component({

  selector: 'app-block-user',

  templateUrl: './block-user.html',

  styleUrls: ['./block-user.css'],
  imports: [CommonModule, FormsModule]

})

export class BlockUserComponent {

  uid: number | null = null;

  message: string = '';

  loading: boolean = false;

  constructor(private adminService: AdminService) {}

  blockUser() {

    if (!this.uid) {

      this.message = 'Please enter a valid User ID.';

      return;

    }

    this.loading = true;

    this.adminService.toggleBlockUser(this.uid).subscribe({

      next: (res) => {

        this.message = res;

        this.loading = false;

      },

      error: (err) => {

        if (err.status === 404) this.message = 'User not found.';

        else if (err.status === 401) this.message = 'You are not allowed to block Admins.';

        else this.message = 'Something went wrong.';

        this.loading = false;

      }

    });

  }

}
 