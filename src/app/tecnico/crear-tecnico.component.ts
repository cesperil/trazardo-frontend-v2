import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from 'src/app/services/local-storage.service';



@Component({
  selector: 'app-crear-tecnico',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-tecnico.component.html',
})
export class CrearTecnicoComponent {
  tecnico = {
    nombre: '',
    apellidos: '',
    email: '',
    telefono: '',
    letra: '',
  };

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router, @Inject(LocalStorageService) private localStorageService: LocalStorageService) {}

  crearTecnico(): void {
    const url = `${this.apiUrl}/api/tecnicos`;
    const token = this.localStorageService.getItem('authToken');

    if (!token) {
      console.error('Authentication token is missing');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http.post(url, this.tecnico, { headers }).subscribe({
      next: () => {
        this.router.navigate(['/gestion-tecnicos']);
      },
      error: (err) => {
        console.error('Error al crear el técnico:', err);
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/gestion-tecnicos']);
  }
}
