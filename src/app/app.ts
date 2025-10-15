import { Component, signal } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ResultsComponent } from "./student/results/results.component";
import { Header } from "./header/header";
import { Footer } from "./footer/footer";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, ResultsComponent, Header, Footer],
  templateUrl: './app.html',
  styleUrl: './app.css'
})
export class App {
  protected readonly title = signal('OEP-frontend');
}
