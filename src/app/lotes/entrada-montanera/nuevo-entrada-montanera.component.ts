import { Component, OnInit, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from 'src/app/services/local-storage.service';




import { SearchableDropdownComponent } from 'src/app/shared/components/searchable-dropdown/searchable-dropdown.component';

@Component({
  selector: 'app-nuevo-entrada-montanera',
  templateUrl: './nuevo-entrada-montanera.component.html',
  styleUrls: ['./nuevo-entrada-montanera.component.scss'],
  imports: [FormsModule, CommonModule, SearchableDropdownComponent], // Add FormsModule to imports
  standalone: true,
})
export class NuevoEntradaMontaneraComponent implements OnInit {

  tecnicos: any[] = [];
  lote: any = null; // Define the lote property
  fincas: any[] = [];
  loteId: number | null = null;

  entradaMontanera: any = {
    tecnico: null,
    representante: '',
    explotacion: null,
    terminoMunicipal: '',
    titularExplotacion: '',
    fecha: '',
    hora: '',
    numCerdos: 0,
    raza: '',
    pesoMedio: 0,
    descripcionCrotales: '',
    localizacion: '',
    observaciones: '',
    manifestacionCompareciente: '',
    localizacionCrotal: '',
  };

  razaOptions = [
    { value: 'IBERICA100', label: '100% Ibérico' },
    { value: 'IBERICA75', label: '75% Ibérico' },
    { value: 'NO_DETERMINADA', label: 'No se indica' },
  ];


  localizacionCrotalOptions = [
    { value: 'OREJAIZQ', label: 'Oreja izquierda' },
    { value: 'OREJADER', label: 'Oreja derecha' },
    { value: 'NO_DETERMINADA', label: 'No se indica' },
  ];

  private apiUrl = environment.apiUrl;


  constructor(private http: HttpClient, private router: Router,
    private route: ActivatedRoute, @Inject(LocalStorageService) private localStorageService: LocalStorageService) { }

  ngOnInit(): void {

    this.route.queryParams.subscribe((params) => {
      this.entradaMontanera.tecnico = params['tecnicoId'] || null;
      this.entradaMontanera.fincaId = params['fincaId'] || null;
      this.loteId = params['loteId'] || null;
      this.entradaMontanera.loteId = params['loteId'] || null;
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
    const url = `${this.apiUrl}/api/acta-entrada-montanera/create/${this.loteId}`;
    const token = this.localStorageService.getItem('authToken');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    console.log('Datos a guardar:', this.entradaMontanera);

    this.http.post(url, this.entradaMontanera, { headers }).subscribe({
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
    const url = `${this.apiUrl}/api/acta-entrada-montanera/datos-iniciales-acta/${this.loteId}`;
    const token = this.localStorageService.getItem('authToken');
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    this.http.get<any>(url, { headers }).subscribe({
      next: (data) => {
        // Map the response data to the form fields
        //this.aforo.tecnico = data.tecnico?.id || null;
        this.entradaMontanera.lote = data.lote?.lote || null;
        this.entradaMontanera.tecnico = this.entradaMontanera.tecnico || null;
        this.entradaMontanera.representante = data.representante || '';
        this.entradaMontanera.explotacion = this.entradaMontanera.fincaId || null;
        this.entradaMontanera.terminoMunicipal = data.explotacion?.termino_municipal || '';
        this.entradaMontanera.provincia = data.explotacion?.provincia || '';
        this.entradaMontanera.titularExplotacion = data.titularExplotacion || '';
        this.entradaMontanera.numeroRegistroDO = data.numeroRegistroDO || '';
        this.entradaMontanera.fecha = data.fecha || '';
        this.entradaMontanera.hora = data.hora || '';
        this.entradaMontanera.numCerdos = data.numCerdos || 0;
        this.entradaMontanera.raza = data.raza || '';
        this.entradaMontanera.pesoMedio = data.pesoMedio || 0;
        this.entradaMontanera.descripcionCrotales = data.descripcionCrotales || '';
        this.entradaMontanera.localizacionCrotal = data.localizacionCrotal || '';
        this.entradaMontanera.observaciones = data.observaciones || '';
        this.entradaMontanera.declaracion = data.declaracion || '';
      },
      error: (err) => {
        console.error('Error loading initial data:', err);
      },
    });
  }


}
