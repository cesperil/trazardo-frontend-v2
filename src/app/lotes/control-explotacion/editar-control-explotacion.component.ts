import { Component, OnInit, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from 'src/app/services/local-storage.service';



@Component({
  selector: 'app-editar-control-explotacion',
  templateUrl: './editar-control-explotacion.component.html',
  styleUrls: ['./editar-control-explotacion.component.scss'],
  imports: [FormsModule, CommonModule], // Add FormsModule to imports
  standalone: true,
})
export class EditarControlExplotacionComponent implements OnInit {

  tecnicos: any[] = [];
  lote: any = null; // Define the lote property
  fincas: any[] = [];
  loteId: number | null = null;

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
      crotalDesde: '',
      crotalHasta: '',
      localizacion: '',
      otrasIndicaciones: '',
      alimentacionManejo: '',
      manifestacionCompareciente: '',
      localizacionCrotal: '',
    };


  constructor(private http: HttpClient, private router: Router,
    private route: ActivatedRoute, @Inject(LocalStorageService) private localStorageService: LocalStorageService ) {}

  ngOnInit(): void {

    this.route.queryParams.subscribe((params) => {
          this.controlExplotacion.tecnico = params['tecnicoId'] || null;
          this.controlExplotacion.fincaId = params['fincaId'] || null;
          this.loteId = params['loteId'] || null;
          this.controlExplotacion.loteId = params['loteId'] || null;
    });
    this.fetchTecnicos();
    this.fetchFincas();
    //this.loadInitialData();
    this.loadAllData();
  }

  fetchTecnicos(): void {
    const url = `${this.apiUrl}/api/tecnicos`;
    const token = this.localStorageService.getItem('authToken');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.get<any[]>(url, { headers }).subscribe({
      next: (data) => (this.tecnicos = data),
      error: (err) => console.error('Error fetching técnicos:', err),
    });
  }

 fetchFincas(): void {

      const url = `${this.apiUrl}/api/explotaciones`; // Replace with your API endpoint
      const token = this.localStorageService.getItem('authToken');
      const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
      this.http.get<any[]>(url,{ headers }).subscribe({
        next: (data) => (this.fincas = data),
        error: (err) => console.error('Error fetching fincas:', err),
      });
      console.log('Fincas cargadas:', this.fincas);
 }

  guardar(): void {
    const url = `${this.apiUrl}/api/acta-control-explotacion/create/${this.loteId}`;
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
    this.router.navigate(['/detalle-lote'], { queryParams: { loteId: this.loteId} });
  }


  loadAllData(): void {
    const url = `${this.apiUrl}/api/acta-control-explotacion/all-datos-acta-by-lote/${this.loteId}`;
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
        this.controlExplotacion.horaInicioVisita = data.horaInicioVisita || '';
        this.controlExplotacion.horaFinVisita = data.horaFinVisita || '';
        this.controlExplotacion.numCerdos = data.numCerdos || 0;
        this.controlExplotacion.crotalDesde = data.crotalDesde || '';
        this.controlExplotacion.crotalHasta = data.crotalHasta || '';
        this.controlExplotacion.observaciones = data.observaciones || '';
        this.controlExplotacion.declaracion = data.declaracion || '';
        this.controlExplotacion.alimentacionManejo = data.alimentacionManejo || '';
        this.controlExplotacion.manifestacionCompareciente = data.manifestacionCompareciente || '';
        this.controlExplotacion.otrasIndicaciones = data.otrasIndicaciones || '';
      },
      error: (err) => {
        console.error('Error loading initial data:', err);
      },
    });
  }




}
