import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from 'src/app/services/local-storage.service';


@Component({
  selector: 'app-editar-tecnico',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editar-tecnico.component.html',
})
export class EditarTecnicoComponent implements OnInit {
  tecnico = {
    id: 0,
    nombre: '',
    apellidos: '',
    email: '',
    telefono: '',
    letra: '',
  };

  private apiUrl = environment.apiUrl;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
  @Inject(LocalStorageService)  private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.obtenerTecnico(id);
  }

  obtenerTecnico(id: number): void {

    const url = `${this.apiUrl}/api/tecnicos/${id}`;
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
        this.tecnico = data;
      },
      error: (err) => {
        console.error('Error fetching técnico:', err);
      },
    });
  }

  actualizarTecnico(): void {
    const url = `${this.apiUrl}/api/tecnicos/${this.tecnico.id}`;
    const token = this.localStorageService.getItem('authToken');

    if (!token) {
      console.error('Authentication token is missing');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http.put(url, this.tecnico, { headers }).subscribe({
      next: () => {
        this.router.navigate(['/gestion-tecnicos']);
      },
      error: (err) => {
        console.error('Error al actualizar el técnico:', err);
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/gestion-tecnicos']);
  }
}
