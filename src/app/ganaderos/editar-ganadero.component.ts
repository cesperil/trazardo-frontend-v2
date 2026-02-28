import { Component, OnInit, Inject } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from 'src/app/services/local-storage.service';



@Component({
  selector: 'app-editar-ganadero',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editar-ganadero.component.html',
})
export class EditarGanaderoComponent implements OnInit {
  ganadero = {
    id: 0,
    nombre: '',
    apellidos: '',
    nif: '',
    localidad: '',
    provincia: '',
    direccion: '',
    telefono: '',
    correoElectronico: '',
    ibanCtaBancaria: '',
    titularCtraBancaria: '',
    activo: true,
  };

  private apiUrl = environment.apiUrl;


  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router,
    @Inject(LocalStorageService) private localStorageService: LocalStorageService
  ) { }

  ngOnInit(): void {
    const id = this.route.snapshot.params['id'];
    this.obtenerGanadero(id);
  }

  obtenerGanadero(id: number): void {

    const url = `${this.apiUrl}/api/ganaderos/${id}`;
    const token = this.localStorageService.getItem('authToken');

    if (!token) {
      console.error('Authentication token is missing');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http.get<any>(url, { headers }).subscribe({
      next: (data) => {
        this.ganadero = data;
      },
      error: (err) => {
        console.error('Error fetching ganadero:', err);
      },
    });
  }

  editarGanadero(): void {
    const url = `${this.apiUrl}/api/ganaderos/${this.ganadero.id}`;
    const token = this.localStorageService.getItem('authToken');

    if (!token) {
      console.error('Authentication token is missing');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`,
    });

    this.http.put(url, this.ganadero, { headers }).subscribe({
      next: () => {
        console.log('Ganadero actualizado exitosamente');
        this.router.navigate(['/gestion-ganaderos']);
      },
      error: (err) => {
        console.error('Error al actualizar el ganadero:', err);
      },
    });
  }

  cancelar(): void {
    this.router.navigate(['/gestion-ganaderos']);
  }
}
