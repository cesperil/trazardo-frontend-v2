import { Component, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { CommonModule } from '@angular/common';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { BreadcrumbComponent } from '../shared/breadcrumb/breadcrumb.component';


@Component({
  selector: 'app-consulta-lotes',
  standalone: true,
  imports: [CommonModule, BreadcrumbComponent],
  templateUrl: './consulta-lotes.component.html',
  styleUrls: ['./consulta-lotes.component.scss'],
})
export class ConsultaLotesComponent {
  fincaId: number | null = null;
  fincaNombre: string = '';
  lotes: any[] = [];

  private apiUrl = environment.apiUrl;

  constructor(private router: Router, private route: ActivatedRoute,
    private http: HttpClient, @Inject(LocalStorageService)  private localStorageService: LocalStorageService) {

  }

  ngOnInit(): void {
    this.route.queryParams.subscribe((params) => {
      this.fincaId = Number(params['fincaId']);
      this.fincaNombre = params['fincaNombre'] || '';

      if (this.fincaId) {
        this.fetchLotes();
      }
    });
  }

fetchLotes(): void {


    const url = `${this.apiUrl}/api/lotes/lotes/por-finca/${this.fincaId}`;
    const token = this.localStorageService.getItem('authToken'); // Retrieve the token from localStorage

    if (!token) {
      console.error('Authentication token is missing');
      return;
    }

    const headers = new HttpHeaders({
      Authorization: `Bearer ${token}`, // Add the Bearer token
    });

    this.http.get<any[]>(url, { headers }).subscribe({
      next: (data) => {
        this.lotes = data;
        console.log('Lotes fetched successfully:', data);
      },
      error: (err) => {
        console.error('Error fetching lotes:', err);
      },
    });
  }

  goToLoteDetail(loteId: number): void {
    this.router.navigate(['/detalle-lote'], { queryParams: { loteId } });
  }

  createLote(): void {
    this.router.navigate(['/crear-lote'], { queryParams: { fincaId: this.fincaId } });
  }
}
