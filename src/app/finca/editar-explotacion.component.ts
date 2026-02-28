import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from 'src/app/services/local-storage.service';


@Component({
  selector: 'app-editar-explotacion',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editar-explotacion.component.html',
})
export class EditarExplotacionComponent implements OnInit {
  explotacion = {
    id: 0,
    nombre: '',
    ganadero: '',
    hectareas: 0,
    telefono: '',
    rega: '',
    termino_municipal: '',
    numeroRegistroDO: '',
    provincia: '',
    activo: true,
  };

  provincias: string[] = [
    'BADAJOZ', 'CACERES',
  ];

  private apiUrl = environment.apiUrl;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    @Inject(LocalStorageService) private localStorageService: LocalStorageService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.obtenerExplotacion(id);
  }

  obtenerExplotacion(id: number): void {
    const url = `${this.apiUrl}/api/explotaciones/${id}`;
    const token = this.localStorageService.getItem('authToken');

    if (!token) {
      console.error('Authentication token is missing');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http.get(url, { headers }).subscribe({
      next: (data: any) => {
        this.explotacion = data;
      },
      error: (err) => {
        console.error('Error fetching explotación:', err);
      },
    });
  }

  actualizarExplotacion(): void {
    const url = `${this.apiUrl}/api/explotaciones/${this.explotacion.id}`;
    const token = this.localStorageService.getItem('authToken');

    if (!token) {
      console.error('Authentication token is missing');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http.put(url, this.explotacion, { headers }).subscribe({
      next: () => {
        console.log('Explotación actualizada exitosamente');
        this.router.navigate(['/gestion-explotaciones']);
      },
      error: (err) => {
        console.error('Error al actualizar la explotación:', err);
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/gestion-explotaciones']);
  }
}
