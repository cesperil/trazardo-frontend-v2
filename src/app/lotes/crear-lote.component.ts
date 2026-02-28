import { Component, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from 'src/app/services/local-storage.service';


import { SearchableDropdownComponent } from 'src/app/shared/components/searchable-dropdown/searchable-dropdown.component';

@Component({
  selector: 'app-crear-lote',
  standalone: true,
  imports: [CommonModule, FormsModule, SearchableDropdownComponent],
  templateUrl: './crear-lote.component.html',
  styleUrls: ['./crear-lote.component.scss'],
})
export class CrearLoteComponent {
  loteId: string = '';
  fincaId: number | null = null;
  lotes: any[] = [];
  seriesCrotales: { crotalDesde: string, crotalHasta: string }[] = [{ crotalDesde: '', crotalHasta: '' }];
  localizacionCrotal: string = 'NO_DETERMINADA'; // Default value
  raza: string = 'NO_DETERMINADA'; // Default value
  ganaderos: any[] = [];
  ganaderoId: number | null = null;
  fechaNacimiento: string = '';

  private apiUrl = environment.apiUrl;


  tecnicoId: string = '';
  isAdmin: boolean = false;
  tecnicos: any[] = [];
  explotaciones: any[] = [];
  selectedTecnicoId: number | null = null;
  selectedFincaId: number | null = null;
  fincaNombre: string = '';

  constructor(public router: Router, public route: ActivatedRoute,
    private http: HttpClient, @Inject(LocalStorageService) private localStorageService: LocalStorageService) {
    this.route.queryParams.subscribe(params => {
      this.fincaId = params['fincaId'] ? Number(params['fincaId']) : null;
      if (this.fincaId) {
        this.selectedFincaId = this.fincaId;
      }
    });
  }

  ngOnInit(): void {
    const role = this.localStorageService.getItem('authRole');
    this.isAdmin = role === 'Admin' || role === 'Administrador';

    if (this.isAdmin) {
      this.fetchTecnicos();
      this.fetchFincas();
    }

    // Obtén el ID de la finca desde los parámetros de la URL
    this.route.queryParams.subscribe((params) => {
      const paramFincaId = params['fincaId'] ? Number(params['fincaId']) : null;
      if (paramFincaId) {
        this.fincaId = paramFincaId;
        this.selectedFincaId = paramFincaId;
      }

      if (this.fincaId) {
        const tecnicoId = this.localStorageService.getItem('tecnicoID');
        if (tecnicoId && !this.isAdmin) {
          this.fetchNuevoLote(this.fincaId, tecnicoId);
        } else if (tecnicoId) {
          // Admin
        }

      }
    });
    this.fetchGanaderos();
  }

  onSelectionChange(): void {
    console.log('Selected finca:', this.selectedFincaId);
    if (this.selectedFincaId) {
      this.fincaId = this.selectedFincaId;
      const selected = this.explotaciones.find(f => f.id === this.selectedFincaId);
      if (selected) {
        console.log('Selected finca:', selected);
        this.fincaNombre = selected.nombre;
      }
    }

    if (this.isAdmin && this.selectedFincaId && this.selectedTecnicoId) {
      this.fetchNuevoLote(this.selectedFincaId, this.selectedTecnicoId.toString());
    }
  }


  fetchNuevoLote(fincaId: number, tecnicoId: string): void {
    const url = `${this.apiUrl}/api/lotes/nuevo-lote/${fincaId}/${tecnicoId}`;
    const token = this.localStorageService.getItem('authToken'); // Retrieve the token from localStorage
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Add the Bearer token
    });

    this.http.get<any>(url, { headers }).subscribe({
      next: (data) => {
        console.log('Nuevo lote data:', data);
        this.loteId = data.lote; // Assuming the response contains a loteId field
      },
      error: (err) => {
        console.error('Error fetching nuevo lote:', err);
      },
    });
  }

  fetchGanaderos(): void {
    const url = `${this.apiUrl}/api/ganaderos`;
    const token = this.localStorageService.getItem('authToken');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.get<any[]>(url, { headers }).subscribe({
      next: (data) => {
        this.ganaderos = data.map(g => ({
          ...g,
          nombreCompleto: `${g.nombre} ${g.apellidos}`
        }));
        console.log('Ganaderos fetched:', this.ganaderos);
      },
      error: (err) => console.error('Error fetching ganaderos:', err),
    });
  }

  fetchTecnicos(): void {
    const url = `${this.apiUrl}/api/tecnicos`;
    const token = this.localStorageService.getItem('authToken');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.get<any[]>(url, { headers }).subscribe({
      next: (data) => {
        this.tecnicos = data.map(t => ({
          ...t,
          nombreCompleto: `${t.nombre} ${t.apellidos}`
        }));
        console.log('Tecnicos fetched:', this.tecnicos);
      },
      error: (err) => console.error('Error fetching tecnicos:', err),
    });
  }

  fetchFincas(): void {
    const url = `${this.apiUrl}/api/explotaciones`;
    const token = this.localStorageService.getItem('authToken');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    this.http.get<any[]>(url, { headers }).subscribe({
      next: (data) => {
        this.explotaciones = data;
        console.log('Fincas (explotaciones) fetched:', data);

        if (this.fincaId) {
          const selected = this.explotaciones.find(f => f.id === this.fincaId);
          if (selected) {
            this.fincaNombre = selected.nombre;
          }
        }
      },
      error: (err) => console.error('Error fetching fincas:', err),
    });
  }

  fetchLotesPorFinca(fincaId: number): void {
    const url = `${this.apiUrl}/lotes/por-finca/${fincaId}`;
    const token = this.localStorageService.getItem('authToken'); // Recupera el token de localStorage
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Agrega el token Bearer
    });

    this.http.get<any[]>(url, { headers }).subscribe({
      next: (data) => {
        this.lotes = data;
        console.log('Lotes obtenidos:', data);
      },
      error: (err) => {
        console.error('Error al obtener los lotes:', err);
      },
    });
  }

  saveLote(): void {

    if (!this.selectedFincaId && !this.fincaId) {
      console.error('Finca is required');
      return;
    }

    // Update local fincaId just in case
    if (this.selectedFincaId) this.fincaId = this.selectedFincaId;


    const validSeries = this.seriesCrotales.filter(s => s.crotalDesde && s.crotalHasta);
    if (!this.fincaId || validSeries.length === 0) {
      console.error('All fields are required');
      return;
    }

    const url = `${this.apiUrl}/api/lotes`;
    const token = this.localStorageService.getItem('authToken'); // Retrieve the token from localStorage

    if (!token) {
      console.error('Authentication token is missing');
      return;
    }


    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Add the Bearer token
      'Content-Type': 'application/json', // Specify JSON content type
    });

    let tecnicoData;
    if (this.isAdmin && this.selectedTecnicoId) {
      tecnicoData = { id: this.selectedTecnicoId };
    } else {
      tecnicoData = { id: Number(this.localStorageService.getItem('tecnicoID')) };
    }

    const loteData = {
      lote: this.loteId,
      anio: new Date().getFullYear(),
      finca: this.fincaId,
      seriesCrotales: this.seriesCrotales.filter(s => s.crotalDesde && s.crotalHasta).map(s => ({
        crotalDesde: parseInt(s.crotalDesde, 10),
        crotalHasta: parseInt(s.crotalHasta, 10)
      })),
      localizacionCrotal: this.localizacionCrotal,
      raza: this.raza,
      tecnico: tecnicoData,
      explotacion: {
        id: this.fincaId,
      },
      ganadero: this.ganaderoId ? { id: this.ganaderoId } : null,
      fechaNacimiento: this.fechaNacimiento || null
    };

    console.log('Sending request with headers:', headers);
    console.log('Request payload:', loteData);
    this.http.post(url, loteData, { headers }).subscribe({
      next: (response) => {
        console.log('Lote created successfully:', response);
        if (this.isAdmin) {
          this.router.navigate(['/gestion-lotes-admin']);
        } else {
          this.router.navigate(['/consulta-lotes'], { queryParams: { fincaId: this.fincaId } });
        }
      },
      error: (err) => {
        console.error('Error creating lote:', err);
      },
    });

  }

  cancel(): void {
    if (this.isAdmin) {
      this.router.navigate(['/gestion-lotes-admin']);
    } else {
      this.router.navigate(['/consulta-lotes'], { queryParams: { fincaId: this.fincaId } });
    }
  }
}

