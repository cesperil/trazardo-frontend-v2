import { Component, OnInit, Inject } from '@angular/core';
import { FormsModule } from '@angular/forms'; // Import FormsModule
import { CommonModule } from '@angular/common';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from 'src/app/services/local-storage.service';




@Component({
  selector: 'app-editar-control-peso-vivo',
  templateUrl: './editar-control-peso-vivo.component.html',
  styleUrls: ['./editar-control-peso-vivo.component.scss'],
  standalone: true,
  imports: [FormsModule, CommonModule], // Add FormsModule to imports
})
export class EditarControlPesoVivoComponent implements OnInit {

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

    this.fetchTecnicos();
    this.fetchFincas();

    // Precargar datos de técnico y explotación desde los parámetros de la ruta
    this.route.queryParams.subscribe((params) => {
      this.controlPesoVivo.tecnico = params['tecnicoId'] || null;
      this.controlPesoVivo.fincaId = params['fincaId'] || null;
      this.loteId = params['loteId'] || null;
    });


     this.cargarCrotales();
     this.fetchLoteDetails(Number(this.loteId));
     this.fetchControlPesoVivo(Number(this.loteId));

     this.controlPesoVivo.tecnico = Number(this.route.snapshot.queryParamMap.get('tecnicoId'));
     this.controlPesoVivo.fincaId = Number(this.route.snapshot.queryParamMap.get('fincaId'));

  }



  cargarCrotales(): void {

    const url = `${this.apiUrl}/api/crotales/by-lote/${this.loteId}`;
        const token = this.localStorageService.getItem('authToken');
        const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

        this.http.get<{ id: number; numero: string; peso: number }[]>(url, { headers }).subscribe({
          next: (data) => {
            this.crotales = data;
            console.log('Crotales cargados:', this.crotales);
            /*const totalPeso = this.crotales.reduce((sum, crotal) => sum + crotal.peso, 0);
            this.controlPesoVivo.pesoMedio = this.crotales.length > 0 ? +(totalPeso / this.crotales.length).toFixed(2) : 0;
            console.log('Peso medio:', this.controlPesoVivo.pesoMedio);*/
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
      const url = `${this.apiUrl}/api/tecnicos`; // Replace with your API endpoint
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
              this.router.navigate(['/detalle-lote'], { queryParams: { loteId: this.loteId } });
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

      // Recalculate pesoMedio
        if (recalculatePesoMedio) {
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

      // Recalculate pesoMedio
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



fetchControlPesoVivo(loteId: number): void {
  const url = `${this.apiUrl}/api/control-peso-vivo/by-lote/${loteId}`;
  const token = this.localStorageService.getItem('authToken');
  const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

  this.http.get<any>(url, { headers }).subscribe({
    next: (data) => {
      this.controlPesoVivo = {
        tecnico: data.tecnico,
        explotacion: data.explotacion,
        fecha: data.fecha,
        fechaE5M: data.fechaE5M,
        numeroCerdos: data.numCerdos,
        pesoMedio: data.pesoMedio,
        observaciones: data.observaciones,
        /*fincaId: data.explotacion?.id,
        tecnico: data.tecnico?.id,*/

      };
     this.controlPesoVivo.tecnico = Number(this.route.snapshot.queryParamMap.get('tecnicoId'));
     this.controlPesoVivo.fincaId = Number(this.route.snapshot.queryParamMap.get('fincaId'));
      console.log('Control de peso vivo cargado:', this.controlPesoVivo);
    },
    error: (err) => {
      console.error('Error fetching control de peso vivo:', err);
    },
  });
}




descargarDocumento(): void {
  const url = `${this.apiUrl}/api/documentos/generar-acta-control-peso-vivo-F06?idLote=${this.loteId}`;
  const token = this.localStorageService.getItem('authToken');

  if (!token) {
    console.error('Authentication token is missing');
    return;
  }

  const headers = new HttpHeaders({
    'Content-Type': 'application/json',
    Authorization: `Bearer ${token}`,

  });

    const tecnico = this.tecnicos.find(t => t.id == this.controlPesoVivo.tecnico);
    const nombreTecnico = tecnico ? `${tecnico.nombre} ${tecnico.apellidos}` : '';

    console.log('Técnico documento:', tecnico);


    const finca = this.fincas.find(f => f.id == this.controlPesoVivo.fincaId);
    console.log('Control peso vivo:', this.controlPesoVivo);
    console.log('Finca objeto:', this.controlPesoVivo.explotacion);
    console.log('Finca documento:', finca);

    console.log('CONTROL EXPLOTACION :', this.controlPesoVivo);



  const payload = {
        '${FECHADOCUMENTO}': new Date(this.controlPesoVivo.fecha).toLocaleDateString('es-ES'),
        '${NOMBRETECNICO}': nombreTecnico,
        '${NOMBREEXPLOTACION}': finca ? finca.nombre : '',
        '${FECHAE5M}': new Date(this.controlPesoVivo.fechaE5M).toLocaleDateString('es-ES'),
        '${NUMCERDOS}': this.controlPesoVivo.numeroCerdos || '',
        '${PESOMEDIO}': this.controlPesoVivo.pesoMedio || '',
        '${OBSERVACIONES}': this.controlPesoVivo.observaciones || '',
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
