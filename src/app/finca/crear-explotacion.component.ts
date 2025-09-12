import { Component, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from 'src/app/services/local-storage.service';


@Component({
  selector: 'app-crear-explotacion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-explotacion.component.html',
})
export class CrearExplotacionComponent {
  explotacion = {
    nombre: '',
    ganadero: '',
    hectareas: 0,
    telefono: '',
    rega: '',
    termino_municipal: '',
    numeroRegistroDO: '',
    provincia: '',
  };

  provincias: string[] = [
      'BADAJOZ', 'CACERES',
  ];

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router, @Inject(LocalStorageService) private localStorageService: LocalStorageService) {}

  crearExplotacion(): void {
    const url = `${this.apiUrl}/api/explotaciones`;
    const token = this.localStorageService.getItem('authToken');

    if (!token) {
      console.error('Authentication token is missing');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http.post(url, this.explotacion, { headers }).subscribe({
      next: () => {
        console.log('Explotación creada exitosamente');
        this.router.navigate(['/gestion-explotaciones']);
      },
      error: (err) => {
        console.error('Error al crear la explotación:', err);
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/gestion-explotaciones']);
  }
}
