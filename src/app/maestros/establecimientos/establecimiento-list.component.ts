import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { MaestrosService } from '../../services/maestros.service';

@Component({
    selector: 'app-establecimiento-list',
    standalone: true,
    imports: [CommonModule, RouterModule, FormsModule],
    templateUrl: './establecimiento-list.component.html',
    styleUrls: ['./establecimiento-list.component.scss']
})
export class EstablecimientoListComponent implements OnInit {
    establecimientos: any[] = [];
    filteredEstablecimientos: any[] = [];
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
        this.maestrosService.getEstablecimientos().subscribe({
            next: (data) => {
                this.establecimientos = data;
                this.filteredEstablecimientos = data;
                this.loading = false;
                this.applyFilters();
            },
            error: (err) => {
                console.error('Error fetching establecimientos:', err);
                this.loading = false;
            }
        });
    }

    applyFilters(): void {
        this.filteredEstablecimientos = this.establecimientos.filter(item => {
            const matchesNombre = this.filters.nombre ? item.nombre.toLowerCase().includes(this.filters.nombre.toLowerCase()) : true;
            const matchesEmail = this.filters.email ? (item.emailContacto || '').toLowerCase().includes(this.filters.email.toLowerCase()) : true;
            const matchesActivo = this.filters.soloActivos ? item.activo === true : true;
            return matchesNombre && matchesEmail && matchesActivo;
        });
    }

    delete(id: number): void {
        if (confirm('¿Estás seguro de que quieres dar de baja este registro?')) {
            this.maestrosService.deleteEstablecimiento(id).subscribe({
                next: () => {
                    this.fetchData();
                },
                error: (err) => console.error('Error deleting:', err)
            });
        }
    }
}
