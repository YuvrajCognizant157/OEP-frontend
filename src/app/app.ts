import { Component, inject, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ResultsComponent } from "./student/results/results.component";
import { Header } from "./header/header";
import { Footer } from "./footer/footer";
import { CommonModule } from '@angular/common';
import { LayoutService } from './core/services/layout.service';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer,CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  private layoutService = inject(LayoutService);
  
  isLayoutVisible = this.layoutService.isLayoutVisible;
  protected readonly title = signal('OEP-frontend');
}
