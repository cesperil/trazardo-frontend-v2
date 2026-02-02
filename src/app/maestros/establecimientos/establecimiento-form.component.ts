import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { MaestrosService } from '../../services/maestros.service';

@Component({
    selector: 'app-establecimiento-form',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './establecimiento-form.component.html',
    styleUrls: ['./establecimiento-form.component.scss']
})
export class EstablecimientoFormComponent implements OnInit {
    isEditMode = false;
    id: number | null = null;
    establecimiento: any = {
        nombre: '',
        cif: '',
        telefono: '',
        direccion: '',
        localidad: '',
        provincia: '',
        codigoPostal: '',
        emailContacto: '',
        activo: true
    };
    errorMessage = '';

    constructor(
        private maestrosService: MaestrosService,
        private router: Router,
        private route: ActivatedRoute
    ) { }

    ngOnInit(): void {
        const idParam = this.route.snapshot.paramMap.get('id');
        if (idParam) {
            this.isEditMode = true;
            this.id = Number(idParam);
            this.fetchData(this.id);
        }
    }

    fetchData(id: number): void {
        this.maestrosService.getEstablecimientoById(id).subscribe({
            next: (data) => {
                this.establecimiento = data;
            },
            error: (err) => {
                console.error('Error fetching data:', err);
                this.errorMessage = 'No se pudo cargar la información del establecimiento.';
            }
        });
    }

    onSubmit(): void {
        if (this.isEditMode && this.id) {
            this.maestrosService.updateEstablecimiento(this.id, this.establecimiento).subscribe({
                next: () => {
                    this.router.navigate(['/maestros/establecimientos']);
                },
                error: (err) => {
                    console.error('Error updating:', err);
                    this.errorMessage = 'Error al actualizar el establecimiento.';
                }
            });
        } else {
            this.maestrosService.createEstablecimiento(this.establecimiento).subscribe({
                next: () => {
                    this.router.navigate(['/maestros/establecimientos']);
                },
                error: (err) => {
                    console.error('Error creating:', err);
                    this.errorMessage = 'Error al crear el establecimiento. Verifique si el CIF ya existe.';
                }
            });
        }
    }
}
