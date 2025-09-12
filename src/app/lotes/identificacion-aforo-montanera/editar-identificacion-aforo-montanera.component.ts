import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { environment } from 'src/environments/environment';
import { LocalStorageService } from 'src/app/services/local-storage.service';




@Component({
  selector: 'app-editar-identificacion-aforo-montanera',
  templateUrl: './editar-identificacion-aforo-montanera.component.html',
  styleUrls: ['./editar-identificacion-aforo-montanera.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule],
})
export class EditarIdentificacionAforoMontaneraComponent implements OnInit {
  aforo: any = {
    tecnico: null,
    representante: '',
    explotacion: null,
    terminoMunicipal: '',
    provincia: '',
    titularExplotacion: '',
    fecha: '',
    hora: '',
    numCerdos: 0,
    raza: 'NO_DETERMINADA', // Default value
    pesoMedio: 0,
    crotalDesde: '',
    crotalHasta: '',
    muestraPienso: false,
    titularAutorizacion: false,
    copiaResumen: false,
    otrasIndicaciones: '',
    declaracion: '',
    titularDeseaListadoDO: false,
  };

  tecnicos: any[] = [];
  explotaciones: any[] = [];
  loteId: number | null = null; // Replace with the actual lote ID

  razaOptions = [
        { value: 'IBERICA100', label: '100% Ibérico' },
        { value: 'IBERICA75', label: '75% Ibérico' },
        { value: 'NO_DETERMINADA', label: 'No se indica' },
  ];

  private apiUrl = environment.apiUrl;
  constructor(private http: HttpClient, private router: Router,
      private route: ActivatedRoute, @Inject(LocalStorageService) private localStorageService: LocalStorageService) {}

  ngOnInit(): void {

    this.route.queryParams.subscribe((params) => {
          this.aforo.tecnico = params['tecnicoId'] || null;
          this.aforo.finca = params['fincaId'] || null;
          this.aforo.loteId = params['loteId'] || null;
    });

    this.loteId = this.aforo.loteId;


    this.loadTecnicos();
    this.loadExplotaciones();
    this.loadAllData();
  }

  loadAllData(): void {


    const url = `${this.apiUrl}/api/acta-identificacion-montanera/all-datos-acta-by-lote/${this.loteId}`;
    const token = this.localStorageService.getItem('authToken');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    this.http.get<any>(url, { headers }).subscribe({
      next: (data) => {
        // Map the response data to the form fields
        //this.aforo.tecnico = data.tecnico?.id || null;
        this.aforo.tecnico = this.aforo.tecnico || null;
        this.aforo.representante = data.representante || '';
        this.aforo.explotacion = this.aforo.fincaId || null;
        this.aforo.terminoMunicipal = data.explotacion?.termino_municipal || '';
        this.aforo.provincia = data.explotacion?.provincia || '';
        this.aforo.titularExplotacion = data.titularExplotacion || '';
        this.aforo.fecha = data.fecha || '';
        this.aforo.hora = data.hora || '';
        this.aforo.numCerdos = data.numCerdos || 0;
        this.aforo.raza = data.raza || '';
        this.aforo.pesoMedio = data.pesoMedio || 0;
        this.aforo.crotalDesde = data.numCrotalDesde || '';
        this.aforo.crotalHasta = data.numCrotalHasta || '';
        this.aforo.muestraPienso = data.muestraPienso || false;
        this.aforo.titularAutorizacion = data.titularAutorizacion || false;
        this.aforo.copiaResumen = data.copiaResumen || false;
        this.aforo.otrasIndicaciones = data.otrasIndicaciones || '';
        this.aforo.declaracion = data.declaracion || '';
        this.aforo.titularDeseaListadoDO = data.titularDeseaListadoDO || false;
      },
      error: (err) => {
        console.error('Error loading initial data:', err);
      },
    });
  }

  loadTecnicos(): void {
    const url = `${this.apiUrl}/api/tecnicos`;
    const token = this.localStorageService.getItem('authToken');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.get<any[]>(url, { headers }).subscribe({
      next: (data) => {
            console.log('Técnicos cargados:', data); // Verifica los datos obtenidos
            this.tecnicos = data;
      },
      error: (err) => console.error('Error loading técnicos:', err),
    });
  }

  loadExplotaciones(): void {
    const url = `${this.apiUrl}/api/explotaciones`;
    const token = this.localStorageService.getItem('authToken');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.get<any[]>(url, { headers }).subscribe({
       next: (data) => {
            console.log('Explotaciones cargadas:', data); // Verifica los datos obtenidos
            this.explotaciones = data;
       },
      error: (err) => console.error('Error loading explotaciones:', err),
    });
  }

  onSubmit(): void {
    const url = `${this.apiUrl}/api/acta-identificacion-montanera/create/${this.loteId}`;
    const token = this.localStorageService.getItem('authToken');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    console.log('Datos a guardar:', this.aforo); // Verifica los datos antes de enviarlos

    this.http.post(url, this.aforo, { headers }).subscribe({
      next: () => {
        console.log('Identificación Aforo de Montanera saved successfully');
        this.router.navigate(['/detalle-lote'], { queryParams: { loteId: this.loteId } });
      },
      error: (err) => console.error('Error saving Identificación Aforo de Montanera:', err),
    });
  }


   cancelar(): void {
          this.router.navigate(['/detalle-lote'], { queryParams: { loteId: this.loteId } });
    }


}
