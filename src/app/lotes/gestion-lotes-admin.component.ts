import { Component, Inject } from '@angular/core';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { OnInit } from '@angular/core';

@Component({
  selector: 'app-gestion-lotes-admin',
  standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './gestion-lotes-admin.component.html',
  styleUrls: ['./gestion-lotes-admin.component.scss']
})
export class GestionLotesAdminComponent implements OnInit {
  lotes: any[] = [];
  filteredLotes: any[] = [];
  tecnicos: any[] = [];
  explotaciones: any[] = [];
  filters = {
    tecnico: '',
    anio: '',
    explotacion: ''
  };

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private localStorageService: LocalStorageService, private router: Router) {}

  ngOnInit(): void {
    this.fetchData();
  }


  fetchData(): void {
    const urlLotes = `${this.apiUrl}/api/lotes/listado`;
    const urlTecnicos = `${this.apiUrl}/api/tecnicos`;
    const urlExplotaciones = `${this.apiUrl}/api/explotaciones`;
    const token = this.localStorageService.getItem('authToken');

    if (!token) {
      console.error('Authentication token is missing');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http.get<any[]>(urlLotes, { headers }).subscribe({
      next: (data) => {
        this.lotes = data;
        this.filteredLotes = data;
      },
      error: (err) => {
        console.error('Error fetching lotes:', err);
      },
    });

    this.http.get<any[]>(urlExplotaciones, { headers }).subscribe({
        next: (data) => {
          this.explotaciones = data;
        },
        error: (err) => {
          console.error('Error fetching explotaciones:', err);
        },
      });

    this.http.get<any[]>(urlTecnicos, { headers }).subscribe({
          next: (data) => {
            this.tecnicos = data;
          },
          error: (err) => {
            console.error('Error fetching técnicos:', err);
          },
        });
  }

  applyFilters(): void {
    console.log('Applying filters:', this.filters);

    this.filteredLotes = this.lotes.filter(lote => {
      const matchesTecnico = this.filters.tecnico ? lote.tecnicoId == this.filters.tecnico : true;
      const matchesExplotacion = this.filters.explotacion ? lote.explotacionId == this.filters.explotacion : true;
      const matchesAnio = this.filters.anio ? lote.anio === +this.filters.anio : true;
      return matchesTecnico && matchesExplotacion && matchesAnio;
    });
  }

  editarLote(lote: any): void {
    console.log('Editar lote:', lote);
    // Implementa la lógica para editar el lote
    var loteId = lote.id;
    this.router.navigate(['/editar-lote'], { queryParams: { loteId } });
  }

  verDetalleLote(lote: any): void {
    console.log('Ver detalle del lote:', lote);
    var loteId = lote.id;
        this.router.navigate(['/detalle-lote'], { queryParams: { loteId } });

  }

}
