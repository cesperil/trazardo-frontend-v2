import { Routes } from '@angular/router';
import { LoginComponent } from './auth/login/login.component';
import { FincaSelectionComponent } from './finca/finca-selection.component';
import { ConsultaLotesComponent } from './lotes/consulta-lotes.component';
import { CrearLoteComponent } from './lotes/crear-lote.component';
import { DetalleLoteComponent } from './lotes/detalle-lote.component';
import { GestionExplotacionesComponent } from './finca/gestion-explotaciones.component';
import { CrearExplotacionComponent } from './finca/crear-explotacion.component';
import { EditarExplotacionComponent } from './finca/editar-explotacion.component';
import { HomeComponent } from './home/home.component';
import { GestionTecnicosComponent } from './tecnico/gestion-tecnicos.component';
import { GestionUsuariosComponent } from './auth/gestion-usuarios/gestion-usuarios.component';
import { GestionGanaderosComponent } from './ganaderos/gestion-ganaderos.component';
import { CrearGanaderoComponent } from './ganaderos/crear-ganadero.component';
import { EditarGanaderoComponent } from './ganaderos/editar-ganadero.component';
import { CrearTecnicoComponent } from './tecnico/crear-tecnico.component';
import { EditarTecnicoComponent } from './tecnico/editar-tecnico.component';
import { CrearUsuarioComponent } from './auth/gestion-usuarios/crear-usuario.component';
import { EditarUsuarioComponent } from './auth/gestion-usuarios/editar-usuario.component';
import { NuevoAforoMontaneraComponent } from './lotes/aforo-montanera/nuevo-aforo-montanera.component';
import { EditarAforoMontaneraComponent } from './lotes/aforo-montanera/editar-aforo-montanera.component';
import { NuevoControlPesoVivoComponent } from './lotes/control-peso-vivo/nuevo-control-peso-vivo.component';
import { EditarControlPesoVivoComponent } from './lotes/control-peso-vivo/editar-control-peso-vivo.component';
import { NuevoIdentificacionAforoMontaneraComponent } from './lotes/identificacion-aforo-montanera/nuevo-identificacion-aforo-montanera.component';
import { EditarIdentificacionAforoMontaneraComponent } from './lotes/identificacion-aforo-montanera/editar-identificacion-aforo-montanera.component';
import { NuevoEntradaMontaneraComponent } from './lotes/entrada-montanera/nuevo-entrada-montanera.component';
import { EditarEntradaMontaneraComponent } from './lotes/entrada-montanera/editar-entrada-montanera.component';
import { NuevoControlExplotacionComponent } from './lotes/control-explotacion/nuevo-control-explotacion.component';
import { EditarControlExplotacionComponent } from './lotes/control-explotacion/editar-control-explotacion.component';
import { GestionLotesAdminComponent } from './lotes/gestion-lotes-admin.component';
import { EditarLoteComponent } from './lotes/editar-lote.component';


import { NuevoInformeInspeccionReaComponent } from './lotes/informe-inspeccion-REA/nuevo-informe-inspeccion-rea/nuevo-informe-inspeccion-rea';
import { EditarInformeInspeccionReaComponent } from './lotes/informe-inspeccion-REA/editar-informe-inspeccion-rea/editar-informe-inspeccion-rea';
import { EstablecimientoListComponent } from './maestros/establecimientos/establecimiento-list.component';
import { EstablecimientoFormComponent } from './maestros/establecimientos/establecimiento-form.component';
import { ConsignatariaListComponent } from './maestros/consignatarias/consignataria-list.component';
import { ConsignatariaFormComponent } from './maestros/consignatarias/consignataria-form.component';

export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' }, // Redirige a login por defecto
    { path: 'login', component: LoginComponent },
    { path: 'finca-selection', component: FincaSelectionComponent, data: { breadcrumb: 'Selección de Finca' } },
    { path: 'consulta-lotes', component: ConsultaLotesComponent, data: { breadcrumb: 'Consulta de Lotes' } },
    { path: 'crear-lote', component: CrearLoteComponent, data: { breadcrumb: 'Crear Lote' } },
    { path: 'detalle-lote', component: DetalleLoteComponent, data: { breadcrumb: 'Detalle de Lote' } },
    { path: 'gestion-explotaciones', component: GestionExplotacionesComponent, data: { breadcrumb: 'Gestión de Explotaciones' } },
    { path: 'crear-explotacion', component: CrearExplotacionComponent, data: { breadcrumb: 'Crear Explotación' } },
    { path: 'editar-explotacion/:id', component: EditarExplotacionComponent, data: { breadcrumb: 'Editar Explotación' } },
    { path: 'home', component: HomeComponent, data: { breadcrumb: 'Inicio' } },
    { path: 'gestion-usuarios', component: GestionUsuariosComponent, data: { breadcrumb: 'Gestión de Usuarios' } },
    { path: 'gestion-ganaderos', component: GestionGanaderosComponent, data: { breadcrumb: 'Gestión de Ganaderos' } },
    { path: 'crear-ganadero', component: CrearGanaderoComponent, data: { breadcrumb: 'Crear Ganadero' } },
    { path: 'editar-ganadero/:id', component: EditarGanaderoComponent, data: { breadcrumb: 'Editar Ganadero' } },
    { path: 'gestion-tecnicos', component: GestionTecnicosComponent, data: { breadcrumb: 'Gestión de Técnicos' } },
    { path: 'crear-tecnico', component: CrearTecnicoComponent, data: { breadcrumb: 'Crear Técnico' } },
    { path: 'editar-tecnico/:id', component: EditarTecnicoComponent, data: { breadcrumb: 'Editar Técnico' } },
    { path: 'crear-usuario', component: CrearUsuarioComponent, data: { breadcrumb: 'Crear Usuario' } },
    { path: 'editar-usuario/:id', component: EditarUsuarioComponent, data: { breadcrumb: 'Editar Usuario' } },
    { path: 'aforo-montanera/nuevo-aforo-montanera', component: NuevoAforoMontaneraComponent, data: { breadcrumb: 'Nuevo Aforo Montanera' } },
    { path: 'aforo-montanera/editar-aforo-montanera', component: EditarAforoMontaneraComponent, data: { breadcrumb: 'Editar Aforo Montanera' } },
    { path: 'control-peso-vivo/nuevo-control-peso-vivo', component: NuevoControlPesoVivoComponent, data: { breadcrumb: 'Nuevo Control Peso Vivo' } },
    { path: 'control-peso-vivo/editar-control-peso-vivo', component: EditarControlPesoVivoComponent, data: { breadcrumb: 'Editar Control Peso Vivo' } },
    { path: 'identificacion-aforo-montanera/nuevo-identificacion-aforo-montanera', component: NuevoIdentificacionAforoMontaneraComponent, data: { breadcrumb: 'Nuevo Identificación Aforo Montanera' } },
    { path: 'identificacion-aforo-montanera/editar-identificacion-aforo-montanera', component: EditarIdentificacionAforoMontaneraComponent, data: { breadcrumb: 'Editar Identificación Aforo Montanera' } },
    { path: 'entrada-montanera/nuevo-entrada-montanera', component: NuevoEntradaMontaneraComponent, data: { breadcrumb: 'Nueva Entrada Montanera' } },
    { path: 'entrada-montanera/editar-entrada-montanera', component: EditarEntradaMontaneraComponent, data: { breadcrumb: 'Editar Entrada Montanera' } },
    { path: 'control-explotacion/nuevo-control-explotacion', component: NuevoControlExplotacionComponent, data: { breadcrumb: 'Nuevo Control Explotación' } },
    { path: 'control-explotacion/editar-control-explotacion', component: EditarControlExplotacionComponent, data: { breadcrumb: 'Editar Control Explotación' } },
    { path: 'gestion-lotes-admin', component: GestionLotesAdminComponent, data: { breadcrumb: 'Gestión de Lotes' } },
    { path: 'editar-lote', component: EditarLoteComponent, data: { breadcrumb: 'Editar Lote' } },
    { path: 'informe-inspeccion-REA/nuevo-informe-inspeccion-REA', component: NuevoInformeInspeccionReaComponent, data: { breadcrumb: 'Nuevo Informe Inspección REA' } },
    { path: 'informe-inspeccion-REA/editar-informe-inspeccion-REA', component: EditarInformeInspeccionReaComponent, data: { breadcrumb: 'Editar Informe Inspección REA' } },
    // Maestros
    { path: 'maestros/establecimientos', component: EstablecimientoListComponent, data: { breadcrumb: 'Establecimientos de Sacrificio' } },
    { path: 'maestros/establecimientos/crear', component: EstablecimientoFormComponent, data: { breadcrumb: 'Nuevo Establecimiento' } },
    { path: 'maestros/establecimientos/editar/:id', component: EstablecimientoFormComponent, data: { breadcrumb: 'Editar Establecimiento' } },
    { path: 'maestros/consignatarias', component: ConsignatariaListComponent, data: { breadcrumb: 'Empresas Consignatarias' } },
    { path: 'maestros/consignatarias/crear', component: ConsignatariaFormComponent, data: { breadcrumb: 'Nueva Consignataria' } },
    { path: 'maestros/consignatarias/editar/:id', component: ConsignatariaFormComponent, data: { breadcrumb: 'Editar Consignataria' } }
]

