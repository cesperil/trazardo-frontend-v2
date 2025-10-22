import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { environment } from 'src/environments/environment';
import { LocalStorageService } from 'src/app/services/local-storage.service';



@Component({
  selector: 'app-gestion-explotaciones',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-explotaciones.component.html',
})
export class GestionExplotacionesComponent implements OnInit {
  explotaciones: any[] = [];

  private apiUrl = environment.apiUrl;

  filters = {
      nombreExplotacion: '',
      nombreGanadero: '',
      terminoMunicipal: ''
    };

    filteredExplotaciones = [...this.explotaciones];

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
          console.error('Fincas obtenidas:', this.explotaciones);
          this.filteredExplotaciones = [...this.explotaciones];
        },
        error: (err) => {
          console.error('Error fetching fincas:', err);
        },
      });
    }


  applyFilters(): void {
    this.filteredExplotaciones = this.explotaciones.filter(explotacion => {
      const matchesNombre = this.filters.nombreExplotacion
        ? explotacion.nombre.toLowerCase().includes(this.filters.nombreExplotacion.toLowerCase())
        : true;
      const matchesGanadero = this.filters.nombreGanadero
        ? explotacion.ganadero.toLowerCase().includes(this.filters.nombreGanadero.toLowerCase())
        : true;
      const matchesTerminoMunicipal = this.filters.terminoMunicipal
        ? explotacion.termino_municipal.toLowerCase().includes(this.filters.terminoMunicipal.toLowerCase())
        : true;

      return matchesNombre && matchesGanadero && matchesTerminoMunicipal;
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
