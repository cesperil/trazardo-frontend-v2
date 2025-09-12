import { Component, OnInit, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from 'src/app/services/local-storage.service';




@Component({
  selector: 'app-nuevo-control-peso-vivo',
  templateUrl: './nuevo-control-peso-vivo.component.html',
  styleUrls: ['./nuevo-control-peso-vivo.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule], // Add FormsModule to imports
})
export class NuevoControlPesoVivoComponent implements OnInit {

  successMessage: string | null = null; // Define the successMessage property
  lote: any = null; // Define the lote property
  tecnicos: any[] = [];
  fincas: any[] = [];

  isCrotalesVisible: boolean = false; // Property to track visibility of the list


  loteId: number | null = null;

  controlPesoVivo: any = {
    tecnico: null,
    explotacion: null,
    fecha: null,
    fechaE5M: null,
    numeroCerdos: null,
    pesoMedio: null,
    observaciones: '',
  };

  crotales: any[] = []; // Listado de crotales del lote

  private apiUrl = environment.apiUrl;


 constructor(private http: HttpClient, private router: Router,
    private route: ActivatedRoute, @Inject(LocalStorageService) private localStorageService: LocalStorageService) {}


  ngOnInit(): void {
    // Precargar datos de técnico y explotación desde los parámetros de la ruta
    this.route.queryParams.subscribe((params) => {
      this.controlPesoVivo.tecnico = params['tecnicoId'] || null;
      this.controlPesoVivo.fincaId = params['fincaId'] || null;
      this.loteId = params['loteId'] || null;
    });

     this.fetchTecnicos();
     this.fetchFincas();
     this.cargarCrotales();
     this.fetchLoteDetails(Number(this.loteId));
  }

  cargarCrotales(): void {


    const url = `${this.apiUrl}/api/crotales/by-lote/${this.loteId}`;
        const token = this.localStorageService.getItem('authToken');
        const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

        this.http.get<{ id: number; numero: string; peso: number }[]>(url, { headers }).subscribe({
          next: (data) => {
            this.crotales = data;
            console.log('Crotales cargados:', this.crotales);
            //Precargar el número de cerdos con la cantidad de crotales
            this.controlPesoVivo.numeroCerdos = this.crotales.length;
             // Precargar el peso medio con el promedio de los pesos de los crotales
             /*const totalPeso = this.crotales.reduce((sum, crotal) => sum + crotal.peso, 0);
             this.controlPesoVivo.pesoMedio = this.crotales.length > 0 ? totalPeso / this.crotales.length : 0;*/


          },
          error: (err) => {
            console.error('Error fetching crotales:', err);
          },
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

    fetchTecnicos(): void {
      const url = `${this.apiUrl}/api/tecnicos`;
      const token = this.localStorageService.getItem('authToken');
      const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });
      this.http.get<any[]>(url, { headers }).subscribe({
        next: (data) => (this.tecnicos = data),
        error: (err) => console.error('Error fetching técnicos:', err),
      });
    }

  guardar(): void {
    const url = `${this.apiUrl}/api/control-peso-vivo/create/${this.loteId}`;
    const token = this.localStorageService.getItem('authToken'); // Retrieve the auth token
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    // Construct the payload
    const payload = {
      fecha: this.controlPesoVivo.fecha,
      fechaE5M: this.controlPesoVivo.fechaE5M,
      numCerdos: this.controlPesoVivo.numeroCerdos,
      pesoMedio: this.controlPesoVivo.pesoMedio,
      observaciones: this.controlPesoVivo.observaciones,
    };

    // Make the POST request
    this.http.post(url, payload, { headers }).subscribe({
      next: () => {
        console.log('Control de peso vivo guardado con éxito:', payload);
        this.successMessage = 'Control de peso vivo guardado con éxito.';
        this.saveWeights(false); // Save crotal weights after saving controlPesoVivo
        setTimeout(() => {
          this.successMessage = null;
        }, 3000);
      },
      error: (err) => {
        console.error('Error al guardar el control de peso vivo:', err);
      },
    });
  }

  cancelar(): void {
        this.router.navigate(['/detalle-lote'], { queryParams: { loteId: this.loteId } });
  }

   saveWeights(recalculatePesoMedio: boolean = true): void {
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
        numero: crotal.numero,
        lote: crotal.loteId
      }));


      this.http.put(url, payload, { headers }).subscribe({
        next: () => {
                this.successMessage = `Crotales actualizado correctamente`;
                if(recalculatePesoMedio){
                  const totalPeso = this.crotales.reduce((sum, c) => sum + c.peso, 0);
                  this.controlPesoVivo.pesoMedio = this.crotales.length > 0 ? +(totalPeso / this.crotales.length).toFixed(2) : 0;
                }

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

      console.log('Payload para guardar crotal:', payload);

      this.http.put(url, payload, { headers }).subscribe({
        next: () => {
          this.successMessage = `Crotal ${crotal.numero} actualizado correctamente`;

          const totalPeso = this.crotales.reduce((sum, c) => sum + c.peso, 0);
          this.controlPesoVivo.pesoMedio = this.crotales.length > 0 ? +(totalPeso / this.crotales.length).toFixed(2) : 0;
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
      this.isCrotalesVisible = !this.isCrotalesVisible; // Toggle the visibility
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


}
