import { Component, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from 'src/app/services/local-storage.service';





@Component({
  selector: 'app-finca-seleccion',
  standalone: true,
  imports: [FormsModule,CommonModule],
  templateUrl: './finca-selection.component.html',
  styleUrls: ['./finca-selection.component.scss'],
})
export class FincaSelectionComponent {
    fincas: { id: number;
              nombre: string;
              ganadero: string;
              hectareas: number;
              telefono: string;
              rega: string;
              termino_municipal: string;
             }[] = [];
  selectedFinca: number | null = null;

  private apiUrl = environment.apiUrl;

  constructor(private router: Router, private http: HttpClient, @Inject(LocalStorageService) private localStorageService: LocalStorageService) {} // Inject the Router service

  ngOnInit(): void {
    this.fetchFincas();
  }


  fetchFincas(): void {

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
        this.fincas = data;
        console.error('Fincas obtenidas:', data);
      },
      error: (err) => {
        console.error('Error fetching fincas:', err);
      },
    });
  }

  getSelectedFincaName(): string {
    console.log('Selected Finca:', this.selectedFinca);
    const finca = this.fincas.find(f => f.id === Number(this.selectedFinca));
    console.log('Selected Finca despues de asignar valor:', finca);
    return finca ? finca.nombre : '';
  }

  goToConsultaLotes(fincaId: number, fincaNombre: string): void {
        this.router.navigate(['/consulta-lotes'], { queryParams: {fincaId, fincaNombre} });
  }

}
