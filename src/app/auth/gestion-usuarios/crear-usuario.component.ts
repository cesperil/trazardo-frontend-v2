import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from 'src/app/services/local-storage.service';


@Component({
  selector: 'app-crear-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './crear-usuario.component.html',
})
export class CrearUsuarioComponent implements OnInit {
  usuario = {
    username: '',
    password: '',
    role: '',
    tecnico: null,
  };

  roles = ['Admin', 'Inspector'];
  tecnicos: any[] = [];

  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router, @Inject(LocalStorageService) private localStorageService: LocalStorageService) {}

  ngOnInit(): void {
    this.obtenerTecnicos();
  }

  obtenerTecnicos(): void {
    const url = `${this.apiUrl}/api/tecnicos`;
    const token = this.localStorageService.getItem('authToken');

    if (!token) {
      console.error('Authentication token is missing');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http.get<any[]>(url, { headers }).subscribe({
      next: (data) => {
        this.tecnicos = data;
      },
      error: (err) => {
        console.error('Error fetching técnicos:', err);
      },
    });
  }

  crearUsuario(): void {
    const url = `${this.apiUrl}/api/users`;
    const token = this.localStorageService.getItem('authToken');

    if (!token) {
      console.error('Authentication token is missing');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });
    console.log('Creando usuario' , this.usuario);
    this.http.post(url, this.usuario, { headers }).subscribe({
      next: () => {
        this.router.navigate(['/gestion-usuarios']);

      },
      error: (err) => {
        console.error('Error al crear el usuario:', err);
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/gestion-usuarios']);
  }
}
