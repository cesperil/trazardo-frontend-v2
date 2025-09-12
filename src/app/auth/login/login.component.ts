import { Component , Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule, HttpClientModule],
})
export class LoginComponent {
  username = '';
  password = '';
  errorMessage = '';

  constructor(private authService: AuthService, private router: Router) {}

  onLogin() {
    this.authService
      .login({ username: this.username, password: this.password })
      .subscribe({
        next: (response: any) => {
          console.log('Login successful:', response);
          if (response.role === 'Inspector') {
            this.router.navigate(['/finca-selection']);
          }else{
            this.router.navigate(['/home']);
          }

        },
        error: (error: any) => {
          this.errorMessage = 'Invalid credentials';
          console.error('Login error:', error);
        },
      });
  }
}
