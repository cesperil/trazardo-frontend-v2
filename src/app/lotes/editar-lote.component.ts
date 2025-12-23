import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { environment } from 'src/environments/environment';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { EnumDisplayPipe } from '../enums/enum-display.pipe';


@Component({
  selector: 'app-editar-lote',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, EnumDisplayPipe],
  templateUrl: './editar-lote.component.html',
  styleUrls: ['./editar-lote.component.scss']
})
export class EditarLoteComponent implements OnInit {
  lote: any = {}; // Object to hold lote data
  private apiUrl = environment.apiUrl;

  constructor(
    private route: ActivatedRoute,
    public router: Router,
    private http: HttpClient,
    @Inject(LocalStorageService) private localStorageService: LocalStorageService
  ) { }

  tecnicos: any[] = [];
  explotaciones: any[] = [];
  ganaderos: any[] = [];
  loteId: number | null = null; // Replace with the actual lote ID
  tecnicoId: number | null = null;
  explotacionId: number | null = null;
  ganaderoId: number | null = null;

  razaOptions = ['NO_DETERMINADA', 'IBERICA100', 'IBERICA75'];
  localizacionCrotalOptions = ['NO_DETERMINADA', 'OREJAIZQ', 'OREJADER'];

  ngOnInit(): void {
    this.loadLote(() => {
      // Aquí puedes acceder a this.lote después de que se haya cargado
      console.log('Lote cargado en ngOnInit:', this.lote);

      this.tecnicoId = this.lote.tecnico?.id || null;
      this.explotacionId = this.lote.explotacion?.id || null;
      this.ganaderoId = this.lote.ganadero?.id || null;

      this.fetchTecnicos();
      this.fetchFincas();
      this.fetchGanaderos();
    });


  }

  loadLote(callback?: () => void): void {
    const loteId = this.route.snapshot.queryParamMap.get('loteId');
    if (loteId) {
      const url = `${this.apiUrl}/api/lotes/${loteId}`;
      const token = localStorage.getItem('authToken');
      const headers = new HttpHeaders({
        Authorization: `Bearer ${token}`,
      });

      this.http.get(url, { headers }).subscribe({
        next: (data) => {
          this.lote = data;
          console.log('Lote cargado2:', this.lote);
          if (callback) {
            callback(); // Ejecuta el callback después de cargar el lote
          }
        },
        error: (err) => {
          console.error('Error loading lote:', err);
        },
      });
    }
  }

  fetchFincas(): void {
    const url = `${this.apiUrl}/api/explotaciones`; // Replace with your API endpoint
    const token = this.localStorageService.getItem('authToken');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    this.http.get<any[]>(url, { headers }).subscribe({
      next: (data) => (this.explotaciones = data),
      error: (err) => console.error('Error fetching fincas:', err),
    });
    console.log('Fincas cargadas:', this.explotaciones);
  }

  fetchTecnicos(): void {
    const url = `${this.apiUrl}/api/tecnicos`; // Replace with your API endpoint
    const token = this.localStorageService.getItem('authToken');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
    this.http.get<any[]>(url, { headers }).subscribe({
      next: (data) => (this.tecnicos = data),
      error: (err) => console.error('Error fetching técnicos:', err),
    });
  }

  fetchGanaderos(): void {
    const url = `${this.apiUrl}/api/ganaderos`;
    const token = this.localStorageService.getItem('authToken');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.get<any[]>(url, { headers }).subscribe({
      next: (data) => {
        this.ganaderos = data;
      },
      error: (err) => console.error('Error fetching ganaderos:', err),
    });
  }


  saveLote(): void {
    const url = `${this.apiUrl}/api/lotes/${this.lote.id}`;
    const token = localStorage.getItem('authToken');
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.lote.tecnico = this.tecnicoId ? { id: this.tecnicoId } : null;
    this.lote.explotacion = this.explotacionId ? { id: this.explotacionId } : null;
    this.lote.ganadero = this.ganaderoId ? { id: this.ganaderoId } : null;

    this.http.put(url, this.lote, { headers }).subscribe({
      next: () => {
        console.log('Lote updated successfully');
        this.router.navigate(['/gestion-lotes-admin']);
      },
      error: (err) => {
        console.error('Error updating lote:', err);
      },
    });
  }
}
