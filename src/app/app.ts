import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ResultsComponent } from "./student/results/results.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ResultsComponent],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('OEP-frontend');
}
