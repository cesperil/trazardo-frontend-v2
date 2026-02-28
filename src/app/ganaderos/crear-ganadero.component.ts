import { Component, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from 'src/app/services/local-storage.service';



@Component({
  selector: 'app-crear-ganadero',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-ganadero.component.html',
})
export class CrearGanaderoComponent {
  ganadero = {
    nombre: '',
    apellidos: '',
    nif: '',
    localidad: '',
    provincia: '',
    direccion: '',
    telefono: '',
    correoElectronico: '',
    ibanCtaBancaria: '',
    titularCtraBancaria: '',
    activo: true,
  };

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router, @Inject(LocalStorageService) private localStorageService: LocalStorageService) { }

  crearGanadero(): void {
    const url = `${this.apiUrl}/api/ganaderos`;

    const token = this.localStorageService.getItem('authToken');

    if (!token) {
      console.error('Authentication token is missing');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http.post(url, this.ganadero, { headers }).subscribe({
      next: () => {
        console.log('Ganadero creado exitosamente');
        this.router.navigate(['/gestion-ganaderos']);
      },
      error: (err) => {
        console.error('Error al crear el ganadero:', err);
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/gestion-ganaderos']);
  }
}
