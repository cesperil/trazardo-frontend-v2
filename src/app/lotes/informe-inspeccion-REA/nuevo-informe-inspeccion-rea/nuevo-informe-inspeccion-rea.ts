import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { MaestrosService } from 'src/app/services/maestros.service';

@Component({
  selector: 'app-nuevo-informe-inspeccion-rea',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './nuevo-informe-inspeccion-rea.html',
  styleUrl: './nuevo-informe-inspeccion-rea.scss'
})
export class NuevoInformeInspeccionReaComponent implements OnInit {
  informe: any = {
    nombreExplotacion: '',
    numCertificado: '',
    municipio: '',
    infrazaEdad: '',
    codExplotacion: '',
    entInspeccion: '',
    rega: '',
    dniGanadero: '',
    provincia: '',
    nombreGanadero: '',
    fechaAIC: null,
    fechaE5C: null,
    fechaE0: '',
    nombreTecnico: '',
    loteProcedencia: '',
    identificacion: '',
    totalAnimales: null,
    segregadosAnimales: null,
    factorRacial: '',
    alimentacion: '',
    edad: null,
    observaciones: '',
    fechaPrevSacrificio: null,
    establecimientoSacrificio: '',
    empresaConsignataria: '',
    lugarFirma: '',
    fechaFirma: null
  };

  loteId: number | null = null;
  private apiUrl = environment.apiUrl;

  razaOptions = [
    { value: 'IBERICA100', label: '100% Ibérico' },
    { value: 'IBERICA75', label: '75% Ibérico' },
    { value: 'NO_DETERMINADA', label: 'No se indica' },
  ];

  establecimientos: any[] = [];
  consignatarias: any[] = [];

  constructor(
    private http: HttpClient,
    private router: Router,
    private route: ActivatedRoute,
    @Inject(LocalStorageService) private localStorageService: LocalStorageService,
    private maestrosService: MaestrosService
  ) { }

  ngOnInit(): void {
    this.loteId = Number(this.route.snapshot.queryParamMap.get('loteId'));
    this.loadMaestros();
    if (this.loteId) {
      this.fetchInitialData();
    }
  }

  loadMaestros(): void {
    this.maestrosService.getEstablecimientosActivos().subscribe({
      next: (data) => this.establecimientos = data,
      error: (e) => console.error('Error loading establecimientos', e)
    });
    this.maestrosService.getConsignatariasActivas().subscribe({
      next: (data) => this.consignatarias = data,
      error: (e) => console.error('Error loading consignatarias', e)
    });
  }

  fetchInitialData(): void {
    const url = `${this.apiUrl}/api/informe-inspeccion-rea/datos-iniciales-informe-REA/${this.loteId}`;
    const token = this.localStorageService.getItem('authToken');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.get<any>(url, { headers }).subscribe({
      next: (data) => {
        console.log('Initial data fetched:', data);
        this.informe = { ...this.informe, ...data };

        // Handle specific date transformation if needed (e.g. fechaFirma comes as "14 de diciembre de 2025")
        if (data.fechaFirma && !data.fechaFirma.match(/^\d{4}-\d{2}-\d{2}$/)) {
          this.informe.fechaFirma = this.parseSpanishDate(data.fechaFirma);
        }
      },
      error: (err) => {
        console.error('Error fetching initial data:', err);
      }
    });
  }

  parseSpanishDate(dateStr: string): string | null {
    // Example: "14 de diciembre de 2025"
    const months: { [key: string]: string } = {
      'enero': '01', 'febrero': '02', 'marzo': '03', 'abril': '04', 'mayo': '05', 'junio': '06',
      'julio': '07', 'agosto': '08', 'septiembre': '09', 'octubre': '10', 'noviembre': '11', 'diciembre': '12'
    };

    const parts = dateStr.toLowerCase().split(' de ');
    if (parts.length === 3) {
      const day = parts[0].padStart(2, '0');
      const month = months[parts[1]];
      const year = parts[2];
      if (month) {
        return `${year}-${month}-${day}`;
      }
    }
    return null; // Return null if parsing fails, or keep original if that's preferred
  }

  save(): void {
    if (!this.loteId) {
      console.error('Lote ID is missing');
      return;
    }

    const url = `${this.apiUrl}/api/informe-inspeccion-rea/create/${this.loteId}`;
    const token = this.localStorageService.getItem('authToken');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.post(url, this.informe, { headers }).subscribe({
      next: () => {
        console.log('Informe created successfully');
        this.router.navigate(['/detalle-lote'], { queryParams: { loteId: this.loteId } });
      },
      error: (err) => {
        console.error('Error creating Informe:', err);
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/detalle-lote'], { queryParams: { loteId: this.loteId } });
  }
}
