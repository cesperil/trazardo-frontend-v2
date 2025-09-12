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



export const routes: Routes = [
    { path: '', redirectTo: 'login', pathMatch: 'full' }, // Redirige a login por defecto
    { path: 'login', component: LoginComponent },
    { path: 'finca-selection', component: FincaSelectionComponent },
    { path: 'consulta-lotes', component: ConsultaLotesComponent },
    { path: 'crear-lote', component: CrearLoteComponent },
    { path: 'detalle-lote', component: DetalleLoteComponent },
    { path: 'gestion-explotaciones', component: GestionExplotacionesComponent },
    { path: 'crear-explotacion', component: CrearExplotacionComponent },
    { path: 'editar-explotacion/:id', component: EditarExplotacionComponent },
    { path: 'home', component: HomeComponent },
    { path: 'gestion-usuarios', component: GestionUsuariosComponent },
    { path: 'gestion-ganaderos', component: GestionGanaderosComponent },
    { path: 'crear-ganadero', component: CrearGanaderoComponent },
    { path: 'editar-ganadero/:id', component: EditarGanaderoComponent },
    { path: 'gestion-tecnicos', component: GestionTecnicosComponent },
    { path: 'crear-tecnico', component: CrearTecnicoComponent },
    { path: 'editar-tecnico/:id', component: EditarTecnicoComponent },
    { path: 'crear-usuario', component: CrearUsuarioComponent },
    { path: 'editar-usuario/:id', component: EditarUsuarioComponent },
    { path: 'aforo-montanera/nuevo-aforo-montanera', component: NuevoAforoMontaneraComponent },
    { path: 'aforo-montanera/editar-aforo-montanera', component: EditarAforoMontaneraComponent },
    { path: 'control-peso-vivo/nuevo-control-peso-vivo', component: NuevoControlPesoVivoComponent },
    { path: 'control-peso-vivo/editar-control-peso-vivo', component: EditarControlPesoVivoComponent },
    { path: 'identificacion-aforo-montanera/nuevo-identificacion-aforo-montanera', component: NuevoIdentificacionAforoMontaneraComponent },
    { path: 'identificacion-aforo-montanera/editar-identificacion-aforo-montanera', component: EditarIdentificacionAforoMontaneraComponent },
    { path: 'entrada-montanera/nuevo-entrada-montanera', component: NuevoEntradaMontaneraComponent },
    { path: 'entrada-montanera/editar-entrada-montanera', component: EditarEntradaMontaneraComponent },
    { path: 'control-explotacion/nuevo-control-explotacion', component: NuevoControlExplotacionComponent},
    { path: 'control-explotacion/editar-control-explotacion', component: EditarControlExplotacionComponent},] // Ruta para el login];
