import { Component, OnInit } from '@angular/core';

import { AdminService } from '../../core/services/admin.service';{};

import { MatSnackBar } from '@angular/material/snack-bar';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface User {

  uid: number;

  name: string;

  email: string;

  role: string;

  isBlocked: boolean;

  pending?: boolean;

}

@Component({

  selector: 'app-block-user',
  imports:[FormsModule,CommonModule],

  templateUrl: './block-user.html',

  styleUrls: ['./block-user.css']

})

export class BlockUserComponent implements OnInit {

  users: User[] = [];

  filteredUsers: User[] = [];

  search: string = '';

  loading = false;

  constructor(private adminService: AdminService, private snack: MatSnackBar) {}

  ngOnInit(): void {

    this.loadUsers();

  }

  // ✅ Fetch all users

  loadUsers(): void {

    this.loading = true;

    this.adminService.getAllUsers().subscribe({

      next: (res: any[]) => {

        this.users = res.map(u => ({

          uid: u.userId ?? u.UserId ?? u.uid ?? 0,

          name: u.fullName ?? u.FullName ?? u.name ?? 'Unnamed',

          email: u.email ?? u.Email ?? '',

          role: u.role ?? u.Role ?? '',

          isBlocked: u.isBlocked ?? u.IsBlocked ?? false,

          pending: false

        }));

        this.filteredUsers = [...this.users];

        this.loading = false;

      },

      error: () => {

        this.loading = false;

        this.snack.open('Failed to load users', 'Close', { duration: 2500 });

      }

    });

  }

  // ✅ Toggle block/unblock

toggleUser(user: User): void {

  const newIsActive = user.isBlocked; // current blocked => we want to reverse this

  const dto = {

    userId: user.uid,

    isActive: user.isBlocked // backend expects true = active, false = blocked

      ? true  // user is blocked → activating

      : false // user is active → deactivating

  };

  if (!dto.userId) {

    this.snack.open('Invalid user ID', 'Close', { duration: 2500 });

    return;

  }

  user.pending = true;

  this.adminService.toggleUserStatus(dto).subscribe({

    next: () => {

      // ✅ update correct local state

      user.isBlocked = !user.isBlocked;

      user.pending = false;

      const msg = user.isBlocked

        ? 'User blocked successfully'

        : 'User activated successfully';

      this.snack.open(msg, 'Close', { duration: 2500 });

    },

    error: () => {

      user.pending = false;

      this.snack.open('Error updating user status', 'Close', { duration: 2500 });

    }

  });

}
 
  // ✅ Search users

  onSearch(): void {

    const term = this.search.trim().toLowerCase();

    if (!term) {

      this.filteredUsers = [...this.users];

      return;

    }

    this.filteredUsers = this.users.filter(u =>

      u.name.toLowerCase().includes(term) ||

      u.email.toLowerCase().includes(term) ||

      u.role.toLowerCase().includes(term)

    );

  }

}
 