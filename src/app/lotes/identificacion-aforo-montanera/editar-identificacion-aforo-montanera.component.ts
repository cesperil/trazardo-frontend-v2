import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { CommonModule } from '@angular/common'; // Importa CommonModule
import { environment } from 'src/environments/environment';
import { LocalStorageService } from 'src/app/services/local-storage.service';




import { SearchableDropdownComponent } from 'src/app/shared/components/searchable-dropdown/searchable-dropdown.component';

@Component({
  selector: 'app-editar-identificacion-aforo-montanera',
  templateUrl: './editar-identificacion-aforo-montanera.component.html',
  styleUrls: ['./editar-identificacion-aforo-montanera.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule, SearchableDropdownComponent],
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
    descripcionCrotales: '',
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
      this.aforo.tecnico = params['tecnicoId'] ? Number(params['tecnicoId']) : null;
      this.aforo.finca = params['fincaId'] ? Number(params['fincaId']) : null;
      this.loteId = params['loteId'] ? Number(params['loteId']) : null;
      this.aforo.loteId = this.loteId;

      this.loadTecnicos();
      this.loadExplotaciones();
      if (this.loteId) {
        this.loadAllData();
      }
    });
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
        // Asignar el técnico de la BD si existe, si no mantener el del query param
        this.aforo.tecnico = data.tecnico?.id || this.aforo.tecnico;
        this.aforo.representante = data.representante || '';

        // La finca puede venir en data.explotacion o similar.
        this.aforo.finca = data.explotacion?.id || this.aforo.finca;
        this.aforo.explotacion = this.aforo.finca; // Por si algo más usa explotacion.

        this.aforo.terminoMunicipal = data.explotacion?.termino_municipal || '';
        this.aforo.provincia = data.explotacion?.provincia || '';
        this.aforo.titularExplotacion = data.titularExplotacion || '';
        this.aforo.fecha = data.fecha || '';
        this.aforo.hora = data.hora || '';
        this.aforo.numCerdos = data.numCerdos || 0;
        this.aforo.raza = data.raza || '';
        this.aforo.pesoMedio = data.pesoMedio || 0;
        this.aforo.descripcionCrotales = data.descripcionCrotales || '';
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
        this.tecnicos = data.map(t => ({
          ...t,
          nombreCompleto: `${t.nombre} ${t.apellidos}`
        }));
        console.log('Técnicos cargados:', this.tecnicos); // Verifica los datos obtenidos
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

  formatearFechaTexto(fechaStr: string): string {
    if (!fechaStr) return '';
    const date = new Date(fechaStr);
    if (isNaN(date.getTime())) return '';

    const meses = [
      'Enero', 'Febrero', 'Marzo', 'Abril', 'Mayo', 'Junio',
      'Julio', 'Agosto', 'Septiembre', 'Octubre', 'Noviembre', 'Diciembre'
    ];

    const diaText = date.getDate();
    const mesText = meses[date.getMonth()];
    const yearText = date.getFullYear();

    return `${diaText} de ${mesText} de ${yearText}`;
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
      '${FECHADOCUMENTO}': this.formatearFechaTexto(this.aforo.fecha),
      '${HORADOCUMENTO}': this.aforo.hora ? new Date(`1970-01-01T${this.aforo.hora}`).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }) : '',
      '${NOMBREREPRESENTANTE}': this.aforo.representante || '',
      '${NOMBREEXPLOTACION}': this.explotaciones.find(f => f.id == this.aforo.finca)?.nombre || '',
      '${LOCALIDADEXPLOTACION}': this.aforo.terminoMunicipal || '',
      '${PROVINCIAEXPLOTACION}': this.aforo.provincia,
      '${TITULAREXPLOTACION}': this.aforo.titularExplotacion || '',

      '${NUMCERDOS}': this.aforo.numCerdos || '',
      '${RAZACERDO}': this.razaOptions.find(r => r.value === this.aforo.raza)?.label || '',
      '${PESOMEDIO}': this.aforo.pesoMedio || '',
      '${CROTALDESDE}': this.aforo.descripcionCrotales || '',
      '${CROTALHASTA}': '',

      '${MUESTRAPIENSO}': this.aforo.muestraPienso ? 'SI' : 'NO',
      '${DECLARACIONCOMPARECIENTE}': this.aforo.declaracion || '',
      '${EDAD}': this.aforo.edad || '',
      '${MARCATIPOALIMENTO}': this.aforo.marcaTipoAlimento || '',
      '${CALIDADALIMENTO}': this.aforo.calidadAlimento || '',
      '${ENTIDADINSPECCION}': this.aforo.entidadInspeccion || '',
      '${NUMCERTIFICADO}': this.aforo.numCertificado || '',


      '${TITULARDESEALISTADODO}': this.aforo.titularDeseaListadoDO ? 'SI' : 'NO',
      '${TITULARAUTORIZACION}': this.aforo.titularAutorizacion ? 'SI' : 'NO',
      '${COPIARESUMEN}': this.aforo.copiaResumen ? 'C) He recibido copia del resumen de los acuerdos para el desarrollo de la Campaña 2024/2025. SI' : '',
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
