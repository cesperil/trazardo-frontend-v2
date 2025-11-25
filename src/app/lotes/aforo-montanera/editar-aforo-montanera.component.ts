import { Component, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from 'src/app/services/local-storage.service';



@Component({
  selector: 'app-editar-aforo-montanera',
  standalone: true,
  templateUrl: './editar-aforo-montanera.component.html',
  styleUrls: ['./editar-aforo-montanera.component.scss'],
  imports: [FormsModule, CommonModule],
})
export class EditarAforoMontaneraComponent {
  aforoMontanera: any = {
    superficieParcela: null,
    numPiesHa: null,
    arbolesProductivos: null,
    arbolesProductivosHA: null,
    arbolesProductivosTotal: null,
    coefArboreo: null,
    factorNumCercas: null,
    factorMonteBajo: null,
    factorEspeciesSivestres: null,
    factorPoda: null,
    factorAgua: null,
    factorQuerqus: null,
    factorHierba: null,
    cargaGanaderaTotal: null,
    cargaGanaderaModificada: null,
    fincaId: null,
    tecnicoId: null,
  };

  loteId: number | null = null;
  fincas: any[] = [];
  tecnicos: any[] = [];

  private apiUrl = environment.apiUrl;


  constructor(private http: HttpClient, private router: Router,
    private route: ActivatedRoute, @Inject(LocalStorageService) private localStorageService: LocalStorageService) {}

  ngOnInit(): void {
    this.loteId = Number(this.route.snapshot.queryParamMap.get('loteId'));
    this.fetchFincas();
    this.fetchTecnicos();
    this.fetchAforoMontanera();
  }

  fetchFincas(): void {

    const url = `${this.apiUrl}/api/explotaciones`;
    const token = this.localStorageService.getItem('authToken');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    this.http.get<any[]>(url, { headers }).subscribe({
      next: (data) => (this.fincas = data),
      error: (err) => console.error('Error fetching fincas:', err),
    });
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

  fetchAforoMontanera(): void {
    const url = `${this.apiUrl}/api/aforo-montanera/by-lote/${this.loteId}`;
    const token = this.localStorageService.getItem('authToken');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    this.http.get<any>(url, { headers }).subscribe({
      next: (data) => {
        this.aforoMontanera = {
          ...data,
          fincaId: data.explotacion?.id,
          tecnicoId: data.tecnico?.id,
        };
       console.log('Aforo Montanera loaded:', this.aforoMontanera);
      },
      error: (err) => console.error('Error fetching Aforo Montanera:', err),
    });
  }

  saveAforoMontanera(): void {
    const url = `${this.apiUrl}/api/aforo-montanera/${this.aforoMontanera.id}`;
    const token = this.localStorageService.getItem('authToken');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    const payload = {
      ...this.aforoMontanera,
      tecnico: { id: this.aforoMontanera.tecnicoId },
      explotacion: { id: this.aforoMontanera.fincaId },
    };

    this.http.put(url, payload, { headers }).subscribe({
      next: () => {
        console.log('Aforo Montanera updated successfully');
        this.router.navigate(['/detalle-lote'], { queryParams: { loteId: this.loteId } });
      },
      error: (err) => console.error('Error updating Aforo Montanera:', err),
    });
  }

  cancelar(): void {
    this.router.navigate(['/detalle-lote'], { queryParams: { loteId: this.loteId } });
  }

updateCargaGanadera(): void {
  const { numPiesHa, arbolesProductivos, superficieParcela, coefArboreo } = this.aforoMontanera;

  this.aforoMontanera.cargaGanaderaTotal = this.calculateCargaGanadera(
    numPiesHa,
    arbolesProductivos,
    superficieParcela,
    coefArboreo
  );

  this.aforoMontanera.coefArboreo = this.calculateCoefArboreo(
    numPiesHa,
    arbolesProductivos,
    superficieParcela
  );

  this.aforoMontanera.arbolesProductivosHA = this.calculateArbolesProductivosHA(
      numPiesHa,
      this.aforoMontanera.coefArboreo
    );


  this.aforoMontanera.arbolesProductivosTotal = this.calculateArbolesProductivosTotal(
        this.aforoMontanera.arbolesProductivosHA,
        superficieParcela
      );
}

  getValorReferencia(superficieParcela: number): number {
    if (superficieParcela <= 100) {
      return 10;
    } else if (superficieParcela <= 250) {
      return 15;
    } else if (superficieParcela <= 500) {
      return 20;
    } else if (superficieParcela <= 750) {
      return 30;
    } else {
      return 40;
    }
  }

getValoresReferencia(superficieParcela: number, arbolesProductivos: number): String[] {
  const valoresReferencia: String[] = [];
  const valorReferencia = this.getValorReferencia(superficieParcela);

  valoresReferencia.push("-"); // ARBOLEST1
  valoresReferencia.push("-"); // ARBOLEST2
  valoresReferencia.push("-"); // ARBOLEST3
  valoresReferencia.push("-"); // ARBOLEST4
  valoresReferencia.push("-"); // ARBOLEST5

  if (superficieParcela <= 100) {
        valoresReferencia[0] = arbolesProductivos.toString();
      } else if (superficieParcela <= 250) {
        valoresReferencia[1] = arbolesProductivos.toString();
      } else if (superficieParcela <= 500) {
        valoresReferencia[2] = arbolesProductivos.toString();
      } else if (superficieParcela <= 750) {
        valoresReferencia[3] = arbolesProductivos.toString();
      } else {
        valoresReferencia[4] = arbolesProductivos.toString();
  }

  // Example logic for generating reference values


  return valoresReferencia;
}

  calculateArbolesProductivosHA(numPiesHa: number, coefArboreo: number): number {

       return Math.floor(numPiesHa*coefArboreo);
  }

  calculateArbolesProductivosTotal(arbolesProductivosHA: number, superficieParcela: number): number {

         return Math.floor(arbolesProductivosHA*superficieParcela);
  }



  calculateCoefArboreo(numPiesHa: number, arbolesProductivos: number, superficieParcela: number): number {

      const valorReferencia = this.getValorReferencia(superficieParcela);


      if (numPiesHa <= 0 || arbolesProductivos <= 0 || superficieParcela <= 0) {
        return 0;
      }

      console.log('Calculed valorReferencia:', valorReferencia);
      console.log('Calculed porcentaje:', arbolesProductivos / valorReferencia);
      let porcentaje = arbolesProductivos / valorReferencia;
      return Math.floor(porcentaje * 100) / 100;
  }


  calculateCargaGanadera(numPiesHa: number, arbolesProductivos: number, superficieParcela: number, coefArboreo:number): number {

    const valorReferencia = this.getValorReferencia(superficieParcela);


    if (numPiesHa <= 0 || arbolesProductivos <= 0 || superficieParcela <= 0) {
      return 0;
    }

    console.log('Calculed valorReferencia:', valorReferencia);
    console.log('Calculed porcentaje:', arbolesProductivos / valorReferencia);
     let porcentaje = arbolesProductivos / valorReferencia;
      porcentaje = Math.floor(porcentaje * 100) / 100;
    console.log('Calculed porcentaje:', porcentaje);
    const cargaGanadera = (numPiesHa * (porcentaje) * superficieParcela) / 40;
    console.log('Calculated carga ganadera:', cargaGanadera);
    return Math.floor(cargaGanadera * 100) / 100;
  }

descargarDocumento(): void {
  const url = `${this.apiUrl}/api/documentos/generar-aforo-montanera-f16`;
  const token = this.localStorageService.getItem('authToken');

  if (!token) {
    console.error('Authentication token is missing');
    return;
  }

  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,

  });

    const tecnico = this.tecnicos.find(t => t.id === this.aforoMontanera.tecnicoId);
    const nombreTecnico = tecnico ? `${tecnico.nombre} ${tecnico.apellidos}` : '';

    const finca = this.fincas.find(f => f.id === this.aforoMontanera.fincaId);
    console.log('Finca documento:', finca);

    const valoresReferencia = this.getValoresReferencia(this.aforoMontanera.superficieParcela, this.aforoMontanera.arbolesProductivos);



    console.log('AFORO MONTANERA :', this.aforoMontanera);



  const payload = {
        '${NOMBRETECNICO}': nombreTecnico,
       '${FECHADOCUMENTO}': new Date(this.aforoMontanera.fecha).toLocaleDateString(),
       '${HORADOCUMENTO}': this.aforoMontanera.hora ? new Date(`1970-01-01T${this.aforoMontanera.hora}`).toLocaleTimeString('es-ES', { hour: '2-digit', minute: '2-digit' }): '',
        '${NOMBREEXPLOTACION}': this.fincas.find(f => f.id === this.aforoMontanera.fincaId)?.nombre || '',
        '${LOCALIDADEXPLOTACION}': this.fincas.find(f => f.id === this.aforoMontanera.fincaId)?.termino_municipal || '',
        '${PROVINCIAEXPLOTACION}': this.fincas.find(f => f.id === this.aforoMontanera.fincaId)?.provincia || '',
        '${REGISTRODOEXPLOTACION}': this.fincas.find(f => f.id === this.aforoMontanera.fincaId)?.numeroRegistroDO || '',
        '${PROPIETARIOEXPLOTACION}': this.fincas.find(f => f.id === this.aforoMontanera.fincaId)?.ganadero || '',
        '${PERSONAPRESENTEEXPLOTACION}': this.aforoMontanera.personaPresente || '',
        '${NIFPERSONAPRESENTEEXPLOTACION}': this.aforoMontanera.nif || '',
        '${REPRESENTANTEEXPLOTACION}': this.aforoMontanera.calidadDe || '',
        '${HASEXPLOTACION}': this.aforoMontanera.superficieParcela || '',
        '${NUMPIESHA}': this.aforoMontanera.numPiesHa || '',
         '${ARBOLEST1}': valoresReferencia[0],
         '${ARBOLEST2}': valoresReferencia[1],
         '${ARBOLEST3}': valoresReferencia[2],
         '${ARBOLEST4}': valoresReferencia[3],
         '${ARBOLEST5}': valoresReferencia[4],
        '${NUMCERCAS}': this.aforoMontanera.factorNumCercas || '',
        '${MONTEBAJO}': this.aforoMontanera.factorMonteBajo || '',
        '${ESPECIESILVESTRE}': this.aforoMontanera.factorEspeciesSivestres || '',
        '${PODA}': this.aforoMontanera.factorPoda || '',
        '${AGUA}': this.aforoMontanera.factorAgua || '',
        '${ESTADOEDAD}': this.aforoMontanera.estadoEdad || '',
        '${HIERBA}': this.aforoMontanera.factorHierba || '',
        '${COEFARBOREO}': this.aforoMontanera.coefArboreo || '',
        '${ARBOLESPRODUCTIVOSHA}': this.aforoMontanera.arbolesProductivosHA || '',
        '${TOTALARBOLESPRODUCTIVOS}': this.aforoMontanera.arbolesProductivosTotal || '',
        '${NUMCERDOSTOTALES}': this.aforoMontanera.cargaGanaderaTotal || '',
        '${NUMCERDOSMODIFICADOS}': this.aforoMontanera.cargaGanaderaModificada || '',





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


