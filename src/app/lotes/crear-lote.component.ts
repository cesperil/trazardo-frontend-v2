import { Component, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from 'src/app/services/local-storage.service';


@Component({
  selector: 'app-crear-lote',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-lote.component.html',
  styleUrls: ['./crear-lote.component.scss'],
})
export class CrearLoteComponent {
  loteId: string = '';
  fincaId: number | null = null;
  lotes: any[] = [];
  crotalDesde: string = '';
  crotalHasta: string = '';
  localizacionCrotal: string = 'NO_DETERMINADA'; // Default value
  raza: string = 'NO_DETERMINADA'; // Default value

  private apiUrl = environment.apiUrl;


  constructor(public router: Router, public route: ActivatedRoute,
    private http: HttpClient, @Inject(LocalStorageService)  private localStorageService: LocalStorageService) {
    this.route.queryParams.subscribe(params => {
      this.fincaId = Number(params['fincaId']);
    });
  }

  ngOnInit(): void {
    // Obtén el ID de la finca desde los parámetros de la URL
    this.route.queryParams.subscribe((params) => {
      this.fincaId = params['fincaId'] ? Number(params['fincaId']) : null;

      if (this.fincaId) {
        const tecnicoId = this.localStorageService.getItem('tecnicoID');
        if (tecnicoId) {
          this.fetchNuevoLote(this.fincaId, tecnicoId);
        } else {
          console.error('Error: tecnicoId not found in localStorage');
        }

      }
    });
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

      if (!this.fincaId || !this.crotalDesde || !this.crotalHasta) {
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

      const loteData = {
        lote : this.loteId,
        anio : new Date().getFullYear(),
        finca: this.fincaId,
        crotalDesde: this.crotalDesde,
        crotalHasta: this.crotalHasta,
        localizacionCrotal: this.localizacionCrotal,
        raza: this.raza,
        tecnico: {
              id: Number(this.localStorageService.getItem('tecnicoID')),
        },
      };

      console.log('Sending request with headers:', headers);
      console.log('Request payload:', loteData);
      this.http.post(url, loteData, { headers }).subscribe({
        next: (response) => {
          console.log('Lote created successfully:', response);
          this.router.navigate(['/consulta-lotes'], { queryParams: { fincaId: this.fincaId } });
        },
        error: (err) => {
          console.error('Error creating lote:', err);
        },
      });

  }
}
