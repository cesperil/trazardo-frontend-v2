import { Component, Inject, OnInit } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { environment } from 'src/environments/environment';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { MaestrosService } from 'src/app/services/maestros.service';
import { SearchableDropdownComponent } from 'src/app/shared/components/searchable-dropdown/searchable-dropdown.component';

@Component({
    selector: 'app-nuevo-acta-inspeccion-matadero',
    standalone: true,
    imports: [FormsModule, CommonModule, SearchableDropdownComponent],
    templateUrl: './nuevo-acta-inspeccion-matadero.html',
    styleUrl: './nuevo-acta-inspeccion-matadero.scss'
})
export class NuevaActaInspeccionMataderoComponent implements OnInit {
    acta: any = {
        numeroInspeccion: '',
        tecnicoMatadero: '',
        representanteConsignataria: '',
        empresaConsignataria: '',
        ganadero: '',
        explotacion: '',
        numRegistroDo: '',
        numCerdos: null,
        raza: '',
        numLote: '',
        guiaOrdenSanidadPecuaria: '',
        nombreMatadero: '',
        localidadMatadero: '',
        tipoAlimentacion: 'BELLOTA',
        jamonesDesde1: null, jamonesHasta1: null,
        jamonesDesde2: null, jamonesHasta2: null,
        jamonesDesde3: null, jamonesHasta3: null,
        jamonesDesde4: null, jamonesHasta4: null,
        paletasDesde1: null, paletasHasta1: null,
        paletasDesde2: null, paletasHasta2: null,
        paletasDesde3: null, paletasHasta3: null,
        paletasDesde4: null, paletasHasta4: null,
        paletasDesde5: null, paletasHasta5: null,
        pesoVivo: null,
        pesoMedioCanal: null,
        canalesNoPrecintados: null,
        motivo: '',
        observaciones: '',
        operadorElaborador: '',
        propietarioPiezas: '',
        numeroJamones: null,
        numeroPaletas: null,
        balancePrecinto: null,
        noConfomidadNoAplica: false,
        noConfomidadNoConformidad: false,
        txNoConformidad: '',
        lugarFirma: '',
        fechaFirma: new Date().toISOString().split('T')[0]
    };

    loteId: number | null = null;
    informeId: number | null = null;
    private apiUrl = environment.apiUrl;

    razaOptions = [
        { value: 'IBERICA100', label: '100% Ibérico' },
        { value: 'IBERICA75', label: '75% Ibérico' },
        { value: 'IBERICA50', label: '50% Ibérico' },
        { value: 'NO_DETERMINADA', label: 'No se indica' },
    ];

    alimentacionOptions = [
        { value: 'BELLOTA', label: 'Bellota' },
        { value: 'CEBO_CAMPO', label: 'Cebo de Campo' },
        { value: 'CEBO', label: 'Cebo' },
    ];

    establecimientos: any[] = [];
    consignatarias: any[] = [];

    jamonesRanges: { desde: number | null, hasta: number | null }[] = [{ desde: null, hasta: null }];
    paletasRanges: { desde: number | null, hasta: number | null }[] = [{ desde: null, hasta: null }];

    constructor(
        private http: HttpClient,
        private router: Router,
        private route: ActivatedRoute,
        @Inject(LocalStorageService) private localStorageService: LocalStorageService,
        private maestrosService: MaestrosService
    ) { }

    ngOnInit(): void {
        this.loteId = Number(this.route.snapshot.queryParamMap.get('loteId'));
        this.informeId = Number(this.route.snapshot.queryParamMap.get('informeId'));
        this.loadMaestros();
        this.fetchDatosIniciales();
    }

    loadMaestros(): void {
        this.maestrosService.getEstablecimientosActivos().subscribe({
            next: (data) => this.establecimientos = data,
            error: (e) => console.error('Error loading establecimientos', e)
        });
        this.maestrosService.getConsignatariasActivas().subscribe({
            next: (data) => this.consignatarias = data,
            error: (e) => console.error('Error loading consignatarias', e)
        });
    }

    fetchDatosIniciales(): void {
        if (!this.informeId) {
            console.error('Informe ID is missing');
            return;
        }
        const url = `${this.apiUrl}/api/acta-inspeccion-matadero/datos-iniciales/${this.informeId}?loteId=${this.loteId}`;
        const token = this.localStorageService.getItem('authToken');

        const headers = new HttpHeaders({
            'Authorization': `Bearer ${token}`
        });

        this.http.get<any>(url, { headers }).subscribe({
            next: (data) => {
                if (data) {
                    this.acta.numeroInspeccion = data.numeroInspeccion;
                    this.acta.explotacion = data.explotacion;
                    this.acta.ganadero = data.ganadero;
                    this.acta.empresaConsignataria = data.empresaConsignataria;
                    this.acta.numRegistroDo = data.numRegistroDo;
                    this.acta.numCerdos = data.numCerdos;
                    this.acta.raza = data.raza;
                    this.acta.numLote = data.numLote;
                    this.acta.nombreMatadero = data.nombreMatadero;
                    this.acta.localidadMatadero = data.localidadMatadero;
                    this.acta.tecnicoMatadero = data.tecnicoMatadero;
                    this.acta.numeroJamones = data.numeroJamones;
                    this.acta.numeroPaletas = data.numeroPaletas;
                    this.acta.lugarFirma = data.lugarFirma;

                    // Parse ranges if available
                    if (data.jamonesDesde1 || data.jamonesHasta1) {
                        this.jamonesRanges = []; // Reset default empty
                        for (let i = 1; i <= 4; i++) {
                            if (data[`jamonesDesde${i}`] !== null || data[`jamonesHasta${i}`] !== null) {
                                this.jamonesRanges.push({
                                    desde: data[`jamonesDesde${i}`],
                                    hasta: data[`jamonesHasta${i}`]
                                });
                            }
                        }
                        if (this.jamonesRanges.length === 0) this.jamonesRanges.push({ desde: null, hasta: null });
                    }

                    if (data.paletasDesde1 || data.paletasHasta1) {
                        this.paletasRanges = [];
                        for (let i = 1; i <= 5; i++) {
                            if (data[`paletasDesde${i}`] !== null || data[`paletasHasta${i}`] !== null) {
                                this.paletasRanges.push({
                                    desde: data[`paletasDesde${i}`],
                                    hasta: data[`paletasHasta${i}`]
                                });
                            }
                        }
                        if (this.paletasRanges.length === 0) this.paletasRanges.push({ desde: null, hasta: null });
                    }
                }
            },
            error: (e) => console.error('Error fetching initial data', e)
        });
    }

    addJamonesRange() {
        if (this.jamonesRanges.length < 4) {
            this.jamonesRanges.push({ desde: null, hasta: null });
        }
    }

    addPaletasRange() {
        if (this.paletasRanges.length < 5) {
            this.paletasRanges.push({ desde: null, hasta: null });
        }
    }

    save(): void {
        if (!this.informeId) {
            console.error('Informe ID is missing');
            return;
        }

        // Map ranges back to flat fields
        this.jamonesRanges.forEach((range, index) => {
            const i = index + 1;
            this.acta[`jamonesDesde${i}`] = range.desde;
            this.acta[`jamonesHasta${i}`] = range.hasta;
        });

        this.paletasRanges.forEach((range, index) => {
            const i = index + 1;
            this.acta[`paletasDesde${i}`] = range.desde;
            this.acta[`paletasHasta${i}`] = range.hasta;
        });

        const url = `${this.apiUrl}/api/acta-inspeccion-matadero/create/${this.informeId}?loteId=${this.loteId}`;
        const token = this.localStorageService.getItem('authToken');
        const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

        this.http.post(url, this.acta, { headers }).subscribe({
            next: () => {
                console.log('Acta created successfully');
                this.router.navigate(['/detalle-lote'], { queryParams: { loteId: this.loteId } });
            },
            error: (err) => {
                console.error('Error creating Acta:', err);
                alert('Error al guardar el acta. Verifique los datos.');
            },
        });
    }

    cancelar(): void {
        this.router.navigate(['/detalle-lote'], { queryParams: { loteId: this.loteId } });
    }
}
