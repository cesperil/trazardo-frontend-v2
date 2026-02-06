import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { MaestrosService } from 'src/app/services/maestros.service';

@Component({
  selector: 'app-editar-informe-inspeccion-rea',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './editar-informe-inspeccion-rea.html',
  styleUrl: './editar-informe-inspeccion-rea.scss'
})
export class EditarInformeInspeccionReaComponent implements OnInit {
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
  tecnicoId: number | null = null;
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
    this.tecnicoId = Number(this.route.snapshot.queryParamMap.get('tecnicoId'));

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
    // Fallback: If tecnicoId is missing, try using loteId as the second parameter based on the example /2/2
    const secondParam = this.tecnicoId || this.loteId;
    const url = `${this.apiUrl}/api/informe-inspeccion-rea/all-datos-informe-by-lote/${this.loteId}`;
    const token = this.localStorageService.getItem('authToken');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.get<any>(url, { headers }).subscribe({
      next: (data) => {
        console.log('Initial data fetched for edit:', data);
        this.informe = { ...this.informe, ...data };

        // Handle specific date transformation if needed
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
    return null;
  }

  save(): void {
    if (!this.loteId) {
      console.error('Lote ID is missing');
      return;
    }

    // Ideally this would be an update endpoint, but defaulting to create logic as per task scope
    // If an update endpoint is available, switch to PUT /api/informe-inspeccion-rea/update/{id}
    const url = `${this.apiUrl}/api/informe-inspeccion-rea/create/${this.loteId}`;
    const token = this.localStorageService.getItem('authToken');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.post(url, this.informe, { headers }).subscribe({
      next: () => {
        console.log('Informe saved successfully');
        this.router.navigate(['/detalle-lote'], { queryParams: { loteId: this.loteId } });
      },
      error: (err) => {
        console.error('Error saving Informe:', err);
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/detalle-lote'], { queryParams: { loteId: this.loteId } });
  }

  formatDateForPayload(dateStr: string | null): string {
    if (!dateStr) return '';
    const date = new Date(dateStr);
    if (isNaN(date.getTime())) return dateStr; // Return as is if invalid or already formatted
    return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
  }

  descargarDocumento(): void {
    const url = `${this.apiUrl}/api/documentos/generar-informe-inspeccion-REA-F10`;
    const token = this.localStorageService.getItem('authToken');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`
    });

    const payload = {
      "${NOMBREEXPLOTACION}": this.informe.nombreExplotacion || '',
      "${NUMCERTIFICADO}": this.informe.numCertificado || '',
      "${MUNICIPIO}": this.informe.municipio || '',
      "${INFRAZAEDAD}": this.informe.infrazaEdad || '',
      "${CODEXPLOTACION}": this.informe.codExplotacion || '',
      "${ENTIDADINSPECCION}": this.informe.entInspeccion || '',
      "${REGA}": this.informe.rega || '',
      "${DNIGANADERO}": this.informe.dniGanadero || '',
      "${PROVINCIA}": this.informe.provincia || '',
      "${NOMBREGANADERO}": this.informe.nombreGanadero || '',
      "${FECHAAIC}": this.formatDateForPayload(this.informe.fechaAIC),
      "${FECHAE5C}": this.formatDateForPayload(this.informe.fechaE5C),
      "${FECHAE0}": this.informe.fechaE0 || '', // It's a text field now
      "${NOMBRETECNICO}": this.informe.nombreTecnico || '',
      "${LOTEPROCEDENCIA}": this.informe.loteProcedencia || '',
      "${IDENTIFICACION}": this.informe.identificacion || '',
      "${TOTALANIMALES}": this.informe.totalAnimales?.toString() || '',
      "${SEGREGADOSANIMALES}": this.informe.segregadosAnimales?.toString() || '',
      "${FACTORRACIAL}": this.getFactorRacialLabel(this.informe.factorRacial),
      "${ALIMENTACION}": this.informe.factorRacial === 'IBERICA100' ? 'BELLOTA' : (this.informe.alimentacion || ''),
      "${EDAD}": this.informe.edad?.toString() || '',
      "${OBSERVACIONES}": this.informe.observaciones || '',
      "${FECHAPREVSACRIFICIO}": this.formatDateForPayload(this.informe.fechaPrevSacrificio),
      "${ESTABLECIMIENTOSACRIFICIO}": this.informe.establecimientoSacrificio || '',
      "${EMPRESACONSIGNATARIA}": this.informe.empresaConsignataria || '',
      "${LUGARFIRMA}": this.informe.lugarFirma || '',
      "${FECHAFIRMA}": this.formatDateForPayload(this.informe.fechaFirma)
    };

    this.http.post(url, payload, { headers, responseType: 'blob' }).subscribe({
      next: (response) => {
        console.log('Documento generado:', response);
        const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = `Informe_Inspeccion_REA_${this.loteId}.docx`;
        link.click();
        console.log('Documento descargado exitosamente');
      },
      error: (err) => {
        console.error('Error al generar el documento:', err);
      },
    });
  }

  getFactorRacialLabel(value: string): string {
    const option = this.razaOptions.find(o => o.value === value);
    return option ? option.label : value || '';
  }
}
