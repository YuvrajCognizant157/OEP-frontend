import { Component } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  imports: [
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    RouterLink  
  ],
  templateUrl: './about.html',
  styleUrl: './about.css'
})
export class About {

}
