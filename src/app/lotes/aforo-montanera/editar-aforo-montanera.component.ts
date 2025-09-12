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
    const { numPiesHa, arbolesProductivos, superficieParcela } = this.aforoMontanera;

    this.aforoMontanera.cargaGanaderaTotal = this.calculateCargaGanadera(
      numPiesHa,
      arbolesProductivos,
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




  calculateCargaGanadera(numPiesHa: number, arbolesProductivos: number, superficieParcela: number): number {

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

}


