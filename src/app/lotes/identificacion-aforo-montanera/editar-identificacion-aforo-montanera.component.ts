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
    edad: null,
    marcaTipoAlimento: '',
    calidadAlimento: '',
    entidadInspeccion: '',
    numCertificado: '',
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
    private route: ActivatedRoute, @Inject(LocalStorageService) private localStorageService: LocalStorageService) { }

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
        this.aforo.edad = data.edad || null;
        this.aforo.marcaTipoAlimento = data.marcaTipoAlimento || '';
        this.aforo.calidadAlimento = data.calidadAlimento || '';
        this.aforo.entidadInspeccion = data.entidadInspeccion || '';
        this.aforo.numCertificado = data.numCertificado || '';
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



  descargarDocumento(): void {
    const url = `${this.apiUrl}/api/documentos/generar-acta-identificacion-montanera-AIM`;
    const token = this.localStorageService.getItem('authToken');

    if (!token) {
      console.error('Authentication token is missing');
      return;
    }

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,

    });


    const tecnico = this.tecnicos.find(t => t.id == this.aforo.tecnico);
    const nombreTecnico = tecnico ? `${tecnico.nombre} ${tecnico.apellidos}` : '';
    console.log('Tecnico documento:', this.aforo.tecnico);
    console.log('Array tecnicos documento:', this.tecnicos);

    const finca = this.explotaciones.find(f => f.id == this.aforo.finca);
    console.log('Finca documento:', finca);




    console.log('AFORO  :', this.aforo);



    const payload = {

      '${NOMBRETECNICO}': nombreTecnico,
      '${FECHADOCUMENTO}': new Date(this.aforo.fecha).toLocaleDateString(),
      '${HORADOCUMENTO}': this.aforo.hora ? new Date(`1970-01-01T${this.aforo.hora}`).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : '',
      '${NOMBREREPRESENTANTE}': this.aforo.representante || '',
      '${NOMBREEXPLOTACION}': this.explotaciones.find(f => f.id == this.aforo.finca)?.nombre || '',
      '${LOCALIDADEXPLOTACION}': this.aforo.terminoMunicipal || '',
      '${PROVINCIAEXPLOTACION}': this.aforo.provincia,
      '${TITULAREXPLOTACION}': this.aforo.titularExplotacion || '',

      '${NUMCERDOS}': this.aforo.numCerdos || '',
      '${RAZACERDO}': this.razaOptions.find(r => r.value === this.aforo.raza)?.label || '',
      '${PESOMEDIO}': this.aforo.pesoMedio || '',
      '${CROTALDESDE}': this.aforo.crotalDesde || '',
      '${CROTALHASTA}': this.aforo.crotalHasta || '',

      '${MUESTRAPIENSO}': this.aforo.muestraPienso ? 'SI' : 'NO',
      '${DECLARACIONCOMPARECIENTE}': this.aforo.declaracion || '',
      '${EDAD}': this.aforo.edad || '',
      '${MARCATIPOALIMENTO}': this.aforo.marcaTipoAlimento || '',
      '${CALIDADALIMENTO}': this.aforo.calidadAlimento || '',
      '${ENTIDADINSPECCION}': this.aforo.entidadInspeccion || '',
      '${NUMCERTIFICADO}': this.aforo.numCertificado || '',


      '${TITULARDESEALISTADODO}': this.aforo.titularDeseaListadoDO ? 'SI' : 'NO',
      '${TITULARAUTORIZACION}': this.aforo.titularAutorizacion ? 'SI' : 'NO',
      '${COPIARESUMEN}': this.aforo.copiaResumen ? 'SI' : 'NO',
      '${OTRASINDICACIONES}': this.aforo.otrasIndicaciones || '',


    };

    this.http.post(url, payload, { headers, responseType: 'blob' }).subscribe({
      next: (response) => {
        console.log('Documento generado:', response);
        const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
        const link = document.createElement('a');
        link.href = window.URL.createObjectURL(blob);
        link.download = 'documento.docx';
        link.click();
        console.log('Documento descargado exitosamente');
      },
      error: (err) => {
        console.error('Error al generar el documento:', err);
      },
    });
  }

}
