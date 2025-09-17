import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from 'src/app/services/local-storage.service';


@Component({
  selector: 'app-editar-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editar-usuario.component.html',
})
export class EditarUsuarioComponent implements OnInit {
  usuario = {
    id: null,
    username: '',
    password: '',
    role: '',
    tecnico: null,
    tecnicoId: null,
  };

  tecnicoSeleccionado = {
    id: null,
    nombre: '',
    apellidos: '',
    };


  roles = ['Admin', 'Inspector'];
  tecnicos: any[] = [];

  private apiUrl = environment.apiUrl;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
  @Inject(LocalStorageService)  private localStorageService: LocalStorageService
  ) {}

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    const tecnicoId = Number(this.route.snapshot.queryParams['tecnicoid']); // Extract tecnicoId from query params

    this.obtenerTecnicos();
    this.obtenerUsuario(id, tecnicoId);

    this.usuario.tecnico = this.route.snapshot.params['tecnicoid'];
    console.log('Valor inicial de usuario.tecnico:', this.usuario.tecnico);
  }

  obtenerUsuario(id: number, tecnicoId: number): void {
    const url = `${this.apiUrl}/api/users/${id}`;
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
        this.usuario = data;
        console.log('User fetched successfully:', data);
        console.log('Valor de usuario.tecnico:', this.usuario.tecnico);

        if (tecnicoId) {
           this.usuario.tecnico = this.tecnicos.find((tecnico) => tecnico.id === tecnicoId) || null;
        }
      },
      error: (err) => {
        console.error('Error fetching user:', err);
      },
    });
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

  actualizarUsuario(): void {

    const url = `${this.apiUrl}/api/users/${this.usuario.username}`;
    const token = this.localStorageService.getItem('authToken');

    if (!token) {
      console.error('Authentication token is missing');
      return;
    }


    console.log('User updated successfully: ', this.usuario);
    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http.put(url, this.usuario, { headers }).subscribe({
      next: () => {
        console.log('User updated successfully: ', this.usuario);
        this.router.navigate(['/gestion-usuarios']);
      },
      error: (err) => {
        console.error('Error updating user:', err);
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/gestion-usuarios']);
  }
}
