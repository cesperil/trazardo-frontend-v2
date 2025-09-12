import { Component, OnInit, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from 'src/app/services/local-storage.service';



@Component({
  selector: 'app-gestion-tecnicos',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './gestion-tecnicos.component.html',
})
export class GestionTecnicosComponent implements OnInit {
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

  crearTecnico(): void {
    this.router.navigate(['/crear-tecnico']);
  }

  editarTecnico(id: number): void {
    this.router.navigate([`/editar-tecnico/${id}`]);
  }
}
