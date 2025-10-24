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
          this.numActa = params['numActa'] || null;
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
    this.router.navigate(['/detalle-lote'], { queryParams: { loteId: this.loteId} });
  }


  loadAllData(): void {
    const url = `${this.apiUrl}/api/acta-control-explotacion/all-datos-acta-by-lote/${this.loteId}/${this.numActa}`;
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



descargarDocumento(): void {
  const url = `${this.apiUrl}/api/documentos/generar-acta-control-explotacion-E0`;
  const token = this.localStorageService.getItem('authToken');

  if (!token) {
    console.error('Authentication token is missing');
    return;
  }

  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,

  });

    const tecnico = this.tecnicos.find(t => t.id == this.controlExplotacion.tecnico);
    const nombreTecnico = tecnico ? `${tecnico.nombre} ${tecnico.apellidos}` : '';

    console.log('Técnico documento:', tecnico);

    const finca = this.fincas.find(f => f.id == this.controlExplotacion.explotacion);
    console.log('Finca documento:', finca);

    console.log('CONTROL EXPLOTACION :', this.controlExplotacion);


const timeInicioVisita = this.controlExplotacion.horaInicioVisita; // "18:00:00"
const dateTimeInicioVisitaString = `${new Date().toISOString().split('T')[0]}T${timeInicioVisita}`; // "YYYY-MM-DDT18:00:00"
const formattedTimeInicioVisita = new Date(dateTimeInicioVisitaString).toLocaleTimeString('es-ES', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

const timeFinVisita = this.controlExplotacion.horaFinVisita; // "18:00:00"
const dateTimeFinVisitaString = `${new Date().toISOString().split('T')[0]}T${timeFinVisita}`; // "YYYY-MM-DDT18:00:00"
const formattedTimeFinVisita = new Date(dateTimeFinVisitaString).toLocaleTimeString('es-ES', {
  hour: '2-digit',
  minute: '2-digit',
  hour12: false,
});

  const payload = {

        '${NUMLOTE}': this.controlExplotacion.lote || '',
        '${NOMBRETECNICO}': nombreTecnico,
        //'${FECHADOCUMENTO}': this.controlExplotacion.fecha || new Date().toLocaleDateString(),
        '${FECHADOCUMENTO}': new Date(this.controlExplotacion.fecha).toLocaleDateString('es-ES'),
        '${HORADOCUMENTO}': formattedTimeInicioVisita,
        '${NOMBREEXPLOTACION}': this.fincas.find(f => f.id == this.controlExplotacion.explotacion)?.nombre || '',

        '${LOCALIDADEXPLOTACION}': this.controlExplotacion.terminoMunicipal || '',
        '${PROVINCIAEXPLOTACION}': this.controlExplotacion.provincia || '',
        '${REGISTRODOEXPLOTACION}': this.controlExplotacion.numeroRegistroDO || '',
        '${PROPIETARIOEXPLOTACION}': this.controlExplotacion.titularExplotacion || '',
        '${NOMBREREPRESENTANTE}': this.controlExplotacion.representante || '',


       '${NUMCERDOS}': this.controlExplotacion.numCerdos || '',
       '${CROTALDESDE}': this.controlExplotacion.crotalDesde || '',
       '${CROTALHASTA}': this.controlExplotacion.crotalHasta || '',

       '${ALIMENTACIONYMANEJO}': this.controlExplotacion.alimentacionManejo || '',
       '${OTRASINDICACIONES}': this.controlExplotacion.otrasIndicaciones || '',
       '${MANIFIESTOCOMPARECIENTE}': this.controlExplotacion.manifestacionCompareciente || '',
       '${HORAFINVISITA}': formattedTimeFinVisita,
       '${NUMACTA}': this.numActa || '',

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
