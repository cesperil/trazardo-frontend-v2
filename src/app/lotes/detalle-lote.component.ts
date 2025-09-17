import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { EnumDisplayPipe } from '../enums/enum-display.pipe';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from 'src/app/services/local-storage.service';


@Component({
  selector: 'app-detalle-lote',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, EnumDisplayPipe],
  templateUrl: './detalle-lote.component.html',
  styleUrls: ['./detalle-lote.component.scss'],
})
export class DetalleLoteComponent implements OnInit {
  lote: any = null;
  crotales: { id: number; numero: string; peso: number }[] = [];
  successMessage: string | null = null;
  isCrotalesCollapsed = true;


  aforoMontanera: any = null;
  controlPesoVivo: any = null;

  private apiUrl = environment.apiUrl;

  constructor(private route: ActivatedRoute, private http: HttpClient,
    private router: Router, @Inject(LocalStorageService)  private localStorageService: LocalStorageService) {}


  ngOnInit(): void {
    const loteId = this.route.snapshot.queryParamMap.get('loteId');
    if (loteId) {
      this.fetchLoteDetails(Number(loteId));
      this.fetchCrotales(Number(loteId));
      //this.fetchAforoMontanera(Number(loteId));
    }
  }


fetchAforoMontanera(loteId: number): void {

  const url = `${this.apiUrl}/api/aforo-montanera/by-lote/${loteId}`;
  const token = this.localStorageService.getItem('authToken');
  const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

  this.http.get<any>(url, { headers }).subscribe({
    next: (data) => {
      this.aforoMontanera = data;
      console.log('Aforo de Montanera data:', data);
    },
    error: (err) => {
      console.error('Error fetching Aforo de Montanera data:', err);
    },
  });
}

  fetchLoteDetails(loteId: number): void {

    const url = `${this.apiUrl}/api/lotes/${loteId}`;
    const token = this.localStorageService.getItem('authToken');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.get<any>(url, { headers }).subscribe({
      next: (data) => {
         this.lote = data;
         console.log('Datos de lote:', this.lote);
      },
      error: (err) => {
        console.error('Error fetching lote details:', err);
      },
    });
  }

  fetchCrotales(loteId: number): void {
    const url = `${this.apiUrl}/api/crotales/by-lote/${loteId}`;
    const token = this.localStorageService.getItem('authToken');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    this.http.get<{ id: number; numero: string; peso: number }[]>(url, { headers }).subscribe({
      next: (data) => {
        this.crotales = data;
      },
      error: (err) => {
        console.error('Error fetching crotales:', err);
      },
    });
  }

  saveWeights(): void {
    const loteId = this.lote?.id; // Ensure the lote ID is available
    if (!loteId) {
      console.error('Lote ID is missing');
      return;
    }
    const url = `${this.apiUrl}/api/crotales/update-by-lote/${loteId}`;
    const token = this.localStorageService.getItem('authToken');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

      // Construct the payload
    const payload = this.crotales.map(crotal => ({
      id: crotal.id,
      peso: crotal.peso,
    }));


    this.http.put(url, payload, { headers }).subscribe({
      next: () => {
              this.successMessage = `Crotales actualizado correctamente`;
                    setTimeout(() => {
                      this.successMessage = null;
                    }, 3000);
            },
      error: (err) => {
        console.error('Error updating weights:', err);
      },
    });
  }

  saveCrotal(crotal: { id: number; numero: string; peso: number }): void {
    const url = `${this.apiUrl}/api/crotales/${crotal.id}`;
    const token = this.localStorageService.getItem('authToken');
    const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

    const payload = {
      lote: this.lote, // Include the lote details
      numero: crotal.numero, // Include the numero of the crotal
      peso: crotal.peso, // Include the updated weight
    };

    this.http.put(url, payload, { headers }).subscribe({
      next: () => {
        this.successMessage = `Crotal ${crotal.numero} actualizado correctamente`;
              setTimeout(() => {
                this.successMessage = null;
              }, 3000);
      },
      error: (err) => {
        console.error(`Error al actualizar el peso del crotal ${crotal.id}:`, err);
      },
    });
  }


 toggleCrotales(): void {
    this.isCrotalesCollapsed = !this.isCrotalesCollapsed;
  }


 saveAforoMontanera(): void {
   if (this.aforoMontanera) {
     const url = `${this.apiUrl}/api/aforo-montanera/${this.aforoMontanera.id}`;
     const token = this.localStorageService.getItem('authToken');
     const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

     this.http.put(url, this.aforoMontanera, { headers }).subscribe({
       next: () => {
         console.log('Aforo de Montanera saved successfully:', this.aforoMontanera);
       },
       error: (err) => {
         console.error('Error saving Aforo de Montanera:', err);
       },
     });
   } else {
     console.error('No Aforo de Montanera data to save.');
   }
 }

createAforoMontanera(): void {
  if (this.lote?.id) {
    // Redirige a la nueva pantalla con el ID del lote como parámetro
    this.router.navigate(['/aforo-montanera/nuevo-aforo-montanera'], { queryParams: { loteId: this.lote.id } });
  } else {
    console.error('No se puede redirigir porque el ID del lote no está disponible.');
  }
}

  goToFincas(): void {

    this.router.navigate(['/consulta-lotes'], { queryParams: { fincaId: this.lote.finca, fincaNombre: this.lote.finca.nombre}}); // Ajusta la ruta según tu configuración
  }
}
