import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { environment } from 'src/environments/environment';
import { LocalStorageService } from 'src/app/services/local-storage.service';



@Component({
  selector: 'app-gestion-ganaderos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './gestion-ganaderos.component.html',

})
export class GestionGanaderosComponent implements OnInit {
  ganaderos: any[] = [];
  filteredGanaderos: any[] = []; // Filtered list for display
  filters = {
      apellidos: '',
      nif: '',
  };

  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient, private router: Router, @Inject(LocalStorageService) private localStorageService: LocalStorageService) {}

  ngOnInit(): void {
    this.obtenerGanaderos();
  }

  buscarGanaderos(): void {

    this.filteredGanaderos = this.ganaderos.filter(ganadero => {
      const matchesNif = this.filters.nif ? ganadero.nif.toLowerCase().includes(this.filters.nif.toLowerCase()) : true;
      const matchesNombre = this.filters.apellidos ? ganadero.apellidos.toLowerCase().includes(this.filters.apellidos.toLowerCase()) : true;
      return matchesNif && matchesNombre;
    });
  }

  obtenerGanaderos(): void {
    const url = `${this.apiUrl}/api/ganaderos`;
    const token = this.localStorageService.getItem('authToken'); // Retrieve the token from localStorage

    if (!token) {
      console.error('Authentication token is missing');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Add the Bearer token
    });

    this.http.get<any[]>(url, { headers }).subscribe({
      next: (data) => {
        this.ganaderos = data;
        this.filteredGanaderos = this.ganaderos;
        console.log('Ganaderos fetched successfully:', data);
      },
      error: (err) => {
        console.error('Error fetching ganaderos:', err);
      },
    });

  }

 editarGanadero(id: number): void {
   this.router.navigate([`/editar-ganadero/${id}`]);
 }

  eliminarGanadero(id: number): void {
    console.log('Eliminar ganadero con ID:', id);
    // Lógica para eliminar ganadero
  }

  crearGanadero(): void {
    this.router.navigate(['/crear-ganadero']);
  }
}
