import { Component, Inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HttpClientModule } from '@angular/common/http';
import { MenuComponent } from './menu/menu.component';
import { BreadcrumbComponent } from './shared/breadcrumb/breadcrumb.component';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { Title } from '@angular/platform-browser';


@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, MenuComponent, BreadcrumbComponent, CommonModule, HttpClientModule],
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss']
})
export class AppComponent {
  title = 'trazardo-frontend';
  constructor(private router: Router, private titleService: Title) { }

  get isLoginPage(): boolean {
    return this.router.url === '/login';
  }

  ngOnInit(): void {
    this.titleService.setTitle('Dehesa de Extremadura'); // Establece el título global
  }
}
