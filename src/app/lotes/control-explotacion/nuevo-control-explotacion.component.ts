import { Component, OnInit, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from 'src/app/services/local-storage.service';



import { SearchableDropdownComponent } from 'src/app/shared/components/searchable-dropdown/searchable-dropdown.component';

@Component({
  selector: 'app-nuevo-control-explotacion',
  templateUrl: './nuevo-control-explotacion.component.html',
  styleUrls: ['./nuevo-control-explotacion.component.scss'],
  imports: [FormsModule, CommonModule, SearchableDropdownComponent], // Add FormsModule to imports
  standalone: true,
})
export class NuevoControlExplotacionComponent implements OnInit {

  tecnicos: any[] = [];
  lote: any = null; // Define the lote property
  fincas: any[] = [];
  loteId: number | null = null;
  numActa: number | null = null;

  private apiUrl = environment.apiUrl;

  controlExplotacion: any = {
    tecnico: null,
    representante: '',
    explotacion: null,
    terminoMunicipal: '',
    titularExplotacion: '',
    fecha: '',
    horaInicioVisita: '',
    horaFinVisita: '',
    numCerdos: 0,
    descripcionCrotales: '',
    localizacion: '',
    otrasIndicaciones: '',
    alimentacionManejo: '',
    manifestacionCompareciente: '',
    localizacionCrotal: '',
  };


  constructor(private http: HttpClient, private router: Router,
    private route: ActivatedRoute,
    @Inject(LocalStorageService) private localStorageService: LocalStorageService
  ) { }

  ngOnInit(): void {

    this.route.queryParams.subscribe((params) => {
      this.controlExplotacion.tecnico = params['tecnicoId'] || null;
      this.controlExplotacion.fincaId = params['fincaId'] || null;
      this.loteId = params['loteId'] || null;
      this.controlExplotacion.loteId = params['loteId'] || null;
      this.numActa = params['numActa'] || null;
    });
    this.fetchTecnicos();
    this.fetchFincas();
    this.loadInitialData();
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
      },
      error: (err) => console.error('Error fetching técnicos:', err),
    });
  }

  fetchFincas(): void {

    const url = `${this.apiUrl}/api/explotaciones`; // Replace with your API endpoint
    const token = this.localStorageService.getItem('authToken');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    this.http.get<any[]>(url, { headers }).subscribe({
      next: (data) => (this.fincas = data),
      error: (err) => console.error('Error fetching fincas:', err),
    });
    console.log('Fincas cargadas:', this.fincas);
  }

  guardar(): void {
    const url = `${this.apiUrl}/api/acta-control-explotacion/create/${this.loteId}/${this.numActa}`;
    const token = this.localStorageService.getItem('authToken');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    console.log('Datos a guardar:', this.controlExplotacion);

    this.http.post(url, this.controlExplotacion, { headers }).subscribe({
      next: () => {
        console.log('Entrada Montanera guardada con éxito');
        this.router.navigate(['/detalle-lote'], { queryParams: { loteId: this.loteId } });
      },
      error: (err) => console.error('Error al guardar la entrada montanera:', err),
    });
  }

  cancelar(): void {
    this.router.navigate(['/detalle-lote'], { queryParams: { loteId: this.loteId } });
  }


  loadInitialData(): void {
    const url = `${this.apiUrl}/api/acta-control-explotacion/datos-iniciales-acta/${this.loteId}`;
    const token = this.localStorageService.getItem('authToken');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    this.http.get<any>(url, { headers }).subscribe({
      next: (data) => {
        // Map the response data to the form fields
        //this.aforo.tecnico = data.tecnico?.id || null;
        this.controlExplotacion.lote = data.lote?.lote || null;
        this.controlExplotacion.tecnico = this.controlExplotacion.tecnico || null;
        this.controlExplotacion.representante = data.representante || '';
        this.controlExplotacion.explotacion = this.controlExplotacion.fincaId || null;
        this.controlExplotacion.terminoMunicipal = data.explotacion?.termino_municipal || '';
        this.controlExplotacion.provincia = data.explotacion?.provincia || '';
        this.controlExplotacion.titularExplotacion = data.titularExplotacion || '';
        this.controlExplotacion.numeroRegistroDO = data.numeroRegistroDO || '';
        this.controlExplotacion.fecha = data.fecha || '';
        this.controlExplotacion.hora = data.hora || '';
        this.controlExplotacion.numCerdos = data.numCerdos || 0;
        this.controlExplotacion.descripcionCrotales = data.descripcionCrotales || '';
        this.controlExplotacion.observaciones = data.observaciones || '';
        this.controlExplotacion.declaracion = data.declaracion || '';
      },
      error: (err) => {
        console.error('Error loading initial data:', err);
      },
    });
  }


}
