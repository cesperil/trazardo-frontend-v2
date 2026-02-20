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
    selector: 'app-editar-acta-inspeccion-matadero',
    standalone: true,
    imports: [FormsModule, CommonModule, SearchableDropdownComponent],
    templateUrl: './editar-acta-inspeccion-matadero.html',
    styleUrl: './editar-acta-inspeccion-matadero.scss'
})
export class EditarActaInspeccionMataderoComponent implements OnInit {
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
        tipoAlimentacion: '',
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
        balancePrecinto: false,
        noConfomidadNoAplica: false,
        noConfomidadNoConformidad: false,
        txNoConformidad: '',
        lugarFirma: '',
        fechaFirma: null
    };

    actaId: number | null = null;
    loteId: number | null = null;
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

    jamonesRanges: { desde: number | null, hasta: number | null }[] = [];
    paletasRanges: { desde: number | null, hasta: number | null }[] = [];
    establecimientos: any[] = [];
    consignatarias: any[] = [];

    constructor(
        private http: HttpClient,
        private router: Router,
        private route: ActivatedRoute,
        @Inject(LocalStorageService) private localStorageService: LocalStorageService,
        private maestrosService: MaestrosService
    ) { }

    ngOnInit(): void {
        this.loteId = Number(this.route.snapshot.queryParamMap.get('loteId'));
        this.actaId = Number(this.route.snapshot.queryParamMap.get('id')); // Get ID from query param 'id'
        this.loadMaestros();

        if (this.actaId) {
            this.fetchData();
        } else {
            console.error('Acta ID missing in query params');
        }
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

    fetchData(): void {
        const url = `${this.apiUrl}/api/acta-inspeccion-matadero/${this.actaId}`;
        const token = this.localStorageService.getItem('authToken');
        const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

        this.http.get<any>(url, { headers }).subscribe({
            next: (data) => {
                console.log('Acta data fetched:', data);
                this.acta = { ...this.acta, ...data };
                this.parseRanges();
            },
            error: (err) => {
                console.error('Error fetching acta data:', err);
            }
        });
    }

    parseRanges() {
        this.jamonesRanges = [];
        for (let i = 1; i <= 4; i++) {
            const desde = this.acta[`jamonesDesde${i}`];
            const hasta = this.acta[`jamonesHasta${i}`];
            if (desde != null || hasta != null) {
                this.jamonesRanges.push({ desde, hasta });
            }
        }
        if (this.jamonesRanges.length === 0) {
            this.jamonesRanges.push({ desde: null, hasta: null });
        }

        this.paletasRanges = [];
        for (let i = 1; i <= 5; i++) {
            const desde = this.acta[`paletasDesde${i}`];
            const hasta = this.acta[`paletasHasta${i}`];
            if (desde != null || hasta != null) {
                this.paletasRanges.push({ desde, hasta });
            }
        }
        if (this.paletasRanges.length === 0) {
            this.paletasRanges.push({ desde: null, hasta: null });
        }
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
        if (!this.acta.id) {
            console.error('Acta ID is missing, cannot update');
            return;
        }

        // Map ranges back to flat fields
        // Reset all first
        for (let i = 1; i <= 4; i++) { this.acta[`jamonesDesde${i}`] = null; this.acta[`jamonesHasta${i}`] = null; }
        for (let i = 1; i <= 5; i++) { this.acta[`paletasDesde${i}`] = null; this.acta[`paletasHasta${i}`] = null; }

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

        const url = `${this.apiUrl}/api/acta-inspeccion-matadero/${this.acta.id}`;
        const token = this.localStorageService.getItem('authToken');
        const headers = new HttpHeaders({ Authorization: `Bearer ${token}` });

        this.http.put(url, this.acta, { headers }).subscribe({
            next: () => {
                console.log('Acta updated successfully');
                this.router.navigate(['/detalle-lote'], { queryParams: { loteId: this.loteId } });
            },
            error: (err) => {
                console.error('Error updating Acta:', err);
                alert('Error al actualizar el acta.');
            },
        });
    }

    cancelar(): void {
        this.router.navigate(['/detalle-lote'], { queryParams: { loteId: this.loteId } });
    }

    formatDateForPayload(dateStr: string | null): string {
        if (!dateStr) return '';
        const date = new Date(dateStr);
        if (isNaN(date.getTime())) return dateStr;
        return date.toLocaleDateString('es-ES', { day: '2-digit', month: '2-digit', year: 'numeric' });
    }

    descargarDocumento(): void {
        const url = `${this.apiUrl}/api/documentos/generar-acta-inspeccion-matadero`;
        const token = this.localStorageService.getItem('authToken');
        const headers = new HttpHeaders({
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`
        });

        // Construct ranges strings
        const jamonesStr = this.jamonesRanges
            .filter(r => r.desde != null && r.hasta != null)
            .map(r => `${r.desde} al ${r.hasta}`)
            .join(', ');

        const paletasStr = this.paletasRanges
            .filter(r => r.desde != null && r.hasta != null)
            .map(r => `${r.desde} al ${r.hasta}`)
            .join(', ');

        const payload = {
            "${NUMINSPECCION}": this.acta.numeroInspeccion || '',
            "${NOMBREINSPECTOR}": this.acta.tecnicoMatadero || '',
            "${REPRESENTANTECONSIGNATARIA}": this.acta.representanteConsignataria || '',
            "${EMPRESACONSIGNATARIA}": this.acta.empresaConsignataria || '',
            "${NOMBREGANADERO}": this.acta.ganadero || '',
            "${NOMBREEXPLOTACION}": this.acta.explotacion || '',
            "${NUMREGISTRODO}": this.acta.numRegistroDo || '',
            "${NUMCERDOS}": this.acta.numCerdos || '',
            "${RAZALOTE}": this.getLabel(this.razaOptions, this.acta.raza),
            "${NUMLOTE}": this.acta.numLote || '',
            "${GUIAORIGENSANIDAD}": this.acta.guiaOrdenSanidadPecuaria || '',
            "${NOMBREMATADERO}": this.acta.nombreMatadero || '',
            "${LOCALIDADMATADERO}": this.acta.localidadMatadero || '',
            "${TIPOALIMENTACION}": this.getLabel(this.alimentacionOptions, this.acta.tipoAlimentacion),
            "${PESOVIVO}": this.acta.pesoVivo || '',
            "${PESOCANAL}": this.acta.pesoMedioCanal || '',
            "${CANALESNPREC}": this.acta.canalesNoPrecintados || '',
            "${MOTIVO}": this.acta.motivo || '',
            "${OBSERVACIONES}": this.acta.observaciones || '',
            "${OPERADORELABORADOR}": this.acta.operadorElaborador || '',
            "${PROPIETARIOPIEZAS}": this.acta.propietarioPiezas || '',
            "${LUGARFIRMA}": this.acta.lugarFirma || '',
            "${FECHAFIRMA}": this.formatDateForPayload(this.acta.fechaFirma),

            // New fields matched from template
            "${JAMONESDESDEHASTA}": jamonesStr,
            "${PALETASDESDEHASTA}": paletasStr,
            "${NUMJAMONES}": this.acta.numeroJamones || '',
            "${NUMPALETAS}": this.acta.numeroPaletas || '',
            "${NUMCONFORMIDAD}": this.acta.txNoConformidad || '',
            "${BALANCEPRECINTO}": this.acta.balancePrecinto ? 'X' : '',
            "${NOCONFORMIDADNOAPLICA}": this.acta.noConfomidadNoAplica ? 'X' : '',
            "${NOCONFORMIDADNOCONFORMIDAD}": this.acta.noConfomidadNoConformidad ? 'X' : ''
        };

        this.http.post(url, payload, { headers, responseType: 'blob' }).subscribe({
            next: (response) => {
                console.log('Documento generado:', response);
                const blob = new Blob([response], { type: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' });
                const link = document.createElement('a');
                link.href = window.URL.createObjectURL(blob);
                link.download = `Acta_Inspeccion_Matadero_${this.loteId}.docx`;
                link.click();
            },
            error: (err) => {
                console.error('Error al generar el documento:', err);
                alert('Error al generar el documento.');
            },
        });
    }

    getLabel(options: any[], value: string): string {
        const option = options.find(o => o.value === value);
        return option ? option.label : value || '';
    }
}
