import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, ActivatedRoute, RouterModule } from '@angular/router';
import { MaestrosService } from '../../services/maestros.service';

@Component({
    selector: 'app-consignataria-form',
    standalone: true,
    imports: [CommonModule, FormsModule, RouterModule],
    templateUrl: './consignataria-form.component.html',
    styleUrls: ['./consignataria-form.component.scss']
})
export class ConsignatariaFormComponent implements OnInit {
    isEditMode = false;
    id: number | null = null;
    consignataria: any = {
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
        this.maestrosService.getConsignatariaById(id).subscribe({
            next: (data) => {
                this.consignataria = data;
            },
            error: (err) => {
                console.error('Error fetching data:', err);
                this.errorMessage = 'No se pudo cargar la información de la empresa.';
            }
        });
    }

    onSubmit(): void {
        if (this.isEditMode && this.id) {
            this.maestrosService.updateConsignataria(this.id, this.consignataria).subscribe({
                next: () => {
                    this.router.navigate(['/maestros/consignatarias']);
                },
                error: (err) => {
                    console.error('Error updating:', err);
                    this.errorMessage = 'Error al actualizar la empresa.';
                }
            });
        } else {
            this.maestrosService.createConsignataria(this.consignataria).subscribe({
                next: () => {
                    this.router.navigate(['/maestros/consignatarias']);
                },
                error: (err) => {
                    console.error('Error creating:', err);
                    this.errorMessage = 'Error al crear la empresa. Verifique si el CIF ya existe.';
                }
            });
        }
    }
}
