import { Component, inject } from '@angular/core';
import { RouterOutlet } from "@angular/router";
import { SNavbar } from "../s-navbar/s-navbar";
import { CommonModule } from '@angular/common';
import { LayoutService } from '../../core/services/layout.service';

@Component({
  selector: 'app-routing',
  imports: [RouterOutlet, SNavbar, CommonModule],
  templateUrl: './routing.html',
  styleUrl: './routing.css'
})
export class Routing {

   private sLayoutService = inject(LayoutService);
  isSLayoutVisible = this.sLayoutService.isSLayoutVisible;

}
