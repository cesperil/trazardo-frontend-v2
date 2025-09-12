import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { HttpClientModule } from '@angular/common/http';

@Component({
  selector: 'app-gestion-usuarios',
  standalone: true,
  imports: [CommonModule, HttpClientModule],
  templateUrl: './gestion-usuarios.component.html',
  styleUrls: ['./gestion-usuarios.component.scss']
})
export class GestionUsuariosComponent implements OnInit {
  usuarios: any[] = [];
  private apiUrl = environment.apiUrl;

  constructor(private http: HttpClient, private router: Router, @Inject(LocalStorageService) private localStorageService: LocalStorageService) {}

  ngOnInit(): void {
    this.obtenerUsuarios();
  }

obtenerUsuarios(): void {

  const url = `${this.apiUrl}/api/explotaciones`;
      const token = this.localStorageService.getItem('authToken'); // Retrieve the token from localStorage
                const headers = new HttpHeaders({
                  Authorization: `Bearer ${token}`, // Add the Bearer token
                });

  this.http.get(`${this.apiUrl}/api/users`, { headers}).subscribe({
    next: (data: any) => {
      this.usuarios = data;
      console.log("Usuarios  obtenidos:", this.usuarios);
    },
    error: (err) => {
      console.error('Error al obtener usuarios:', err);
    }
  });
}

  editarUsuario(id: number): void {
    console.log('Editar usuario con ID:', id);
    this.router.navigate([`/editar-usuario/${id}`]);

    // Lógica para editar usuario
  }

  eliminarUsuario(id: number): void {
    console.log('Eliminar usuario con ID:', id);
    // Lógica para eliminar usuario
  }

  crearUsuario(): void {
    this.router.navigate(['/crear-usuario']);
      // Lógica para eliminar usuario
  }

}
