import { Component, OnInit, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from 'src/app/services/local-storage.service';




@Component({
  selector: 'app-editar-entrada-montanera',
  templateUrl: './editar-entrada-montanera.component.html',
  styleUrls: ['./editar-entrada-montanera.component.scss'],
  imports: [FormsModule, CommonModule], // Add FormsModule to imports
  standalone: true,
})
export class EditarEntradaMontaneraComponent implements OnInit {

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
      crotalDesde: '',
      crotalHasta: '',
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
      private route: ActivatedRoute, @Inject(LocalStorageService) private localStorageService: LocalStorageService) {}

  ngOnInit(): void {

    this.route.queryParams.subscribe((params) => {
          this.entradaMontanera.tecnico = params['tecnicoId'] || null;
          this.entradaMontanera.fincaId = params['fincaId'] || null;
          this.loteId = params['loteId'] || null;
          this.entradaMontanera.loteId = params['loteId'] || null;
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
      const url = `${this.apiUrl}/api/explotaciones`;
      const token = this.localStorageService.getItem('authToken');
      const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
      this.http.get<any[]>(url,{ headers }).subscribe({
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
    this.router.navigate(['/detalle-lote'], { queryParams: { loteId: this.loteId} });
  }


    loadAllData(): void {
      const url = `${this.apiUrl}/api/acta-entrada-montanera/all-datos-acta-by-lote/${this.loteId}`;
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
          this.entradaMontanera.crotalDesde = data.crotalDesde || '';
          this.entradaMontanera.crotalHasta = data.crotalHasta || '';
          this.entradaMontanera.localizacionCrotal = data.localizacionCrotal || '';
          this.entradaMontanera.observaciones = data.observaciones || '';
          this.entradaMontanera.declaracion = data.declaracion || '';
          this.entradaMontanera.manifestacionCompareciente = data.manifestacionCompareciente || '';
        },
        error: (err) => {
          console.error('Error loading initial data:', err);
        },
      });
    }


descargarDocumento(): void {
  const url = `${this.apiUrl}/api/documentos/generar-acta-entrada-montanera-E5M`;
  const token = this.localStorageService.getItem('authToken');

  if (!token) {
    console.error('Authentication token is missing');
    return;
  }

  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,

  });

    const tecnico = this.tecnicos.find(t => t.id == this.entradaMontanera.tecnico);
    const nombreTecnico = tecnico ? `${tecnico.nombre} ${tecnico.apellidos}` : '';

    console.log('Técnico documento:', tecnico);

    const finca = this.fincas.find(f => f.id == this.entradaMontanera.explotacion);
    console.log('Finca documento:', finca);





    console.log('AFORO MONTANERA :', this.entradaMontanera);

     const selectedRaza = this.razaOptions.find(option => option.value === this.entradaMontanera.raza);
      this.entradaMontanera.raza = selectedRaza ? selectedRaza.label : this.entradaMontanera.raza;

      // Map localizacionCrotal value to its label
      const selectedLocalizacionCrotal = this.localizacionCrotalOptions.find(option => option.value === this.entradaMontanera.localizacionCrotal);
      this.entradaMontanera.localizacionCrotal = selectedLocalizacionCrotal ? selectedLocalizacionCrotal.label : this.entradaMontanera.localizacionCrotal;


console.log('Hora documento:', this.entradaMontanera.hora);
  const payload = {

        '${NUMLOTE}': this.entradaMontanera.lote || '',
        '${NOMBRETECNICO}': nombreTecnico,
        '${FECHADOCUMENTO}': new Date(this.entradaMontanera.fecha).toLocaleDateString(),
        '${HORADOCUMENTO}': this.entradaMontanera.hora ? new Date(`1970-01-01T${this.entradaMontanera.hora}`).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }): '',
        '${NOMBREEXPLOTACION}': this.fincas.find(f => f.id == this.entradaMontanera.explotacion)?.nombre || '',

        '${LOCALIDADEXPLOTACION}': this.entradaMontanera.terminoMunicipal || '',
        '${PROVINCIAEXPLOTACION}': this.entradaMontanera.provincia || '',
        '${REGISTRODOEXPLOTACION}': this.entradaMontanera.numeroRegistroDO || '',
        '${PROPIETARIOEXPLOTACION}': this.entradaMontanera.titularExplotacion || '',
        '${NOMBREREPRESENTANTE}': this.entradaMontanera.representante || '',


       '${NUMCERDOS}': this.entradaMontanera.numCerdos || '',
       '${RAZACERDO}': this.entradaMontanera.raza || '',
       '${PESOMEDIO}': this.entradaMontanera.pesoMedio || '',
       '${CROTALDESDE}': this.entradaMontanera.crotalDesde || '',
       '${CROTALHASTA}': this.entradaMontanera.crotalHasta || '',

       '${LOCALIZACIONCROTAL}': this.entradaMontanera.localizacionCrotal || '',
       '${OBSERVACIONES}': this.entradaMontanera.observaciones || '',
       '${MANIFIESTOCOMPARECIENTE}': this.entradaMontanera.manifestacionCompareciente || '',

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
