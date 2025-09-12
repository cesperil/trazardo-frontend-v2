import { Component, OnInit, Inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { AuthService } from '../services/auth.service';
import { HttpClientModule } from '@angular/common/http';


@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterModule, HttpClientModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss'],
})
export class HomeComponent implements OnInit {
  isAdmin = false;

 constructor(private authService: AuthService) {}
 ngOnInit(): void {
    const role = this.authService.getUserRole();
    console.log('User role:', role);
    this.isAdmin = role === 'Admin';
 }

}
