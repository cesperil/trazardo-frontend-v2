import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { HttpClientModule } from '@angular/common/http';
import { AuthService } from '../services/auth.service'; // Service to get user role



@Component({
  selector: 'app-menu',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
})
export class MenuComponent {
  isAdmin: boolean = false; // Declare and initialize the property


  constructor(private router: Router, @Inject(LocalStorageService)   private localStorageService: LocalStorageService) {
    const role = this.localStorageService.getItem('authRole');
    console.log('User role:', role);
    this.isAdmin = role === 'Admin';
  }

  logout(): void {
    this.localStorageService.removeItem('authToken');
    this.router.navigate(['/login']);
  }


  onIconClick(): void {

      const role = this.localStorageService.getItem('authRole'); // Fetch the user's role
      console.log('Icon clicked. User role:', role);
      if (role === 'Admin') {
        this.router.navigate(['/home']); // Redirect to home for admin
      } else if (role === 'Inspector') {
        this.router.navigate(['/finca-selection']); // Redirect to finca-selection for inspector
      }
  }
}
