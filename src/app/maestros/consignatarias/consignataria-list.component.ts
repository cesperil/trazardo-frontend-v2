import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaestrosService } from '../../services/maestros.service';

@Component({
    selector: 'app-consignataria-list',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
    templateUrl: './consignataria-list.component.html',
    styleUrls: ['./consignataria-list.component.scss']
})
export class ConsignatariaListComponent implements OnInit {
    consignatarias: any[] = [];
    filteredConsignatarias: any[] = [];
    loading = true;
    filters = {
        nombre: '',
        email: '',
        soloActivos: false
    };

    constructor(private maestrosService: MaestrosService, private router: Router) { }

    ngOnInit(): void {
        this.fetchData();
    }

    fetchData(): void {
        this.maestrosService.getConsignatarias().subscribe({
            next: (data) => {
                this.consignatarias = data;
                this.filteredConsignatarias = data;
                this.loading = false;
                this.applyFilters();
            },
            error: (err) => {
                console.error('Error fetching consignatarias:', err);
                this.loading = false;
            }
        });
    }

    applyFilters(): void {
        this.filteredConsignatarias = this.consignatarias.filter(item => {
            const matchesNombre = this.filters.nombre ? item.nombre.toLowerCase().includes(this.filters.nombre.toLowerCase()) : true;
            const matchesEmail = this.filters.email ? (item.emailContacto || '').toLowerCase().includes(this.filters.email.toLowerCase()) : true;
            const matchesActivo = this.filters.soloActivos ? item.activo === true : true;
            return matchesNombre && matchesEmail && matchesActivo;
        });
    }

    delete(id: number): void {
        if (confirm('¿Estás seguro de que quieres dar de baja esta empresa?')) {
            this.maestrosService.deleteConsignataria(id).subscribe({
                next: () => {
                    this.fetchData();
                },
                error: (err) => console.error('Error deleting:', err)
            });
        }
    }
}
