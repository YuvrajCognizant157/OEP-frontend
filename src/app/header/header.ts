import { Component } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatExpansionModule } from '@angular/material/expansion';

@Component({
  selector: 'app-header',
  imports: [MatIconModule, MatButtonModule, MatExpansionModule],
  templateUrl: './header.html',
  styleUrls: ['./header.css']
})
export class Header {

}
