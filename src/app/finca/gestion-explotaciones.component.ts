import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from 'src/app/services/local-storage.service';



@Component({
  selector: 'app-gestion-explotaciones',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gestion-explotaciones.component.html',
})
export class GestionExplotacionesComponent implements OnInit {
  explotaciones: any[] = [];

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router, @Inject(LocalStorageService) private localStorageService: LocalStorageService) {}

  ngOnInit(): void {
    this.obtenerExplotaciones();
  }

  obtenerExplotaciones(): void {
      const url = `${this.apiUrl}/api/explotaciones`;
      const token = this.localStorageService.getItem('authToken'); // Retrieve the token from localStorage
                const headers = new HttpHeaders({
                  Authorization: `Bearer ${token}`, // Add the Bearer token
                });

      this.http.get<{ id: number;
                                    nombre: string;
                                    ganadero: string;
                                    hectareas: number;
                                    telefono: string;
                                    rega: string;
                                    termino_municipal: string; }[]>(url, { headers }).subscribe({
        next: (data) => {
          this.explotaciones = data;
          console.error('Fincas obtenidas:', data);
        },
        error: (err) => {
          console.error('Error fetching fincas:', err);
        },
      });
    }




  crearExplotacion(): void {
    this.router.navigate(['/crear-explotacion']);
  }

  editarExplotacion(id: number): void {
    this.router.navigate([`/editar-explotacion/${id}`]);
  }

  eliminarExplotacion(id: number): void {
    console.log('Eliminar explotación con ID:', id);
    // Add logic to delete explotación
  }
}
