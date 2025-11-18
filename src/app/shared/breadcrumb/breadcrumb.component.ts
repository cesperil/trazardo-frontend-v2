import { Component, OnInit, OnDestroy, Inject } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router, RouterModule } from '@angular/router';
import { filter } from 'rxjs/operators';
import { CommonModule } from '@angular/common';
import { Subscription } from 'rxjs';
import { LocalStorageService } from 'src/app/services/local-storage.service';

interface Breadcrumb {
  label: string;
  url: string;
}

@Component({
  selector: 'app-breadcrumb',
  templateUrl: './breadcrumb.component.html',
  styleUrls: ['./breadcrumb.component.scss'],
  imports: [
    CommonModule,
    RouterModule
  ],
  standalone: true,
})
export class BreadcrumbComponent implements OnInit, OnDestroy {
  breadcrumbs: Breadcrumb[] = [];
  private subscription?: Subscription;

  constructor(private router: Router, private route: ActivatedRoute,
    @Inject(LocalStorageService)  private localStorageService: LocalStorageService) {}

  ngOnInit(): void {
    // Inicializar breadcrumbs al cargar
    this.breadcrumbs = this.createBreadcrumbs(this.route.root);

    // Suscribirse a los cambios de ruta
    this.subscription = this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => {
        this.breadcrumbs = this.createBreadcrumbs(this.route.root);
      });
  }

  ngOnDestroy(): void {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private createBreadcrumbs(
    route: ActivatedRoute,
    url: string = '',
    breadcrumbs: Breadcrumb[] = []
  ): Breadcrumb[] {
    const children: ActivatedRoute[] = route.children;

    if (children.length === 0) {
      console.log('ruta:', this.router.url.startsWith('/home'));
      console.log('breadcrumbs antes de añadir Inicio:', breadcrumbs);
      // Añadir "Inicio" como primer breadcrumb si hay otros breadcrumbs y no estamos en home
      if (breadcrumbs.length > 0 && !this.router.url.startsWith('/home')) {
        const role = this.localStorageService.getItem('authRole');
        const homeUrl = role === 'Admin' ? '/home' : '/finca-selection'; // Definir URL según el rol
        breadcrumbs.unshift({ label: 'Inicio', url: homeUrl });
      }else{
        breadcrumbs.shift(); // Eliminar breadcrumb si es la única entrada
      }
      return breadcrumbs;
    }

    for (const child of children) {
      const routeURL: string = child.snapshot.url
        .map(segment => segment.path)
        .join('/');

      if (routeURL !== '') {
        url += `/${routeURL}`;
      }

      // Obtener la etiqueta del breadcrumb desde los datos de la ruta o generar una automáticamente
      let label = child.snapshot.data['breadcrumb'];

      // Si no hay etiqueta configurada, generar una a partir de la URL
      if (!label && routeURL) {
        label = this.formatLabel(routeURL);
      }

      // Solo añadir breadcrumb si hay una etiqueta válida y no es la ruta raíz o login
      if (label && url !== '' && !url.includes('/login')) {
        breadcrumbs.push({ label, url });
      }

      // Llamada recursiva para procesar rutas hijas
      return this.createBreadcrumbs(child, url, breadcrumbs);
    }

    return breadcrumbs;
  }

  private formatLabel(urlSegment: string): string {
    // Convertir nombres de ruta a etiquetas legibles
    const labelMap: { [key: string]: string } = {
      'home': 'Inicio',
      'gestion-usuarios': 'Gestión de Usuarios',
      'gestion-tecnicos': 'Gestión de Técnicos',
      'gestion-explotaciones': 'Gestión de Explotaciones',
      'gestion-ganaderos': 'Gestión de Ganaderos',
      'gestion-lotes-admin': 'Gestión de Lotes',
      'crear-usuario': 'Crear Usuario',
      'editar-usuario': 'Editar Usuario',
      'crear-tecnico': 'Crear Técnico',
      'editar-tecnico': 'Editar Técnico',
      'crear-explotacion': 'Crear Explotación',
      'editar-explotacion': 'Editar Explotación',
      'crear-ganadero': 'Crear Ganadero',
      'editar-ganadero': 'Editar Ganadero',
      'consulta-lotes': 'Consulta de Lotes',
      'crear-lote': 'Crear Lote',
      'editar-lote': 'Editar Lote',
      'detalle-lote': 'Detalle de Lote',
      'finca-selection': 'Selección de Finca',
      'aforo-montanera': 'Aforo Montanera',
      'nuevo-aforo-montanera': 'Nuevo Aforo Montanera',
      'editar-aforo-montanera': 'Editar Aforo Montanera',
      'control-peso-vivo': 'Control Peso Vivo',
      'nuevo-control-peso-vivo': 'Nuevo Control Peso Vivo',
      'editar-control-peso-vivo': 'Editar Control Peso Vivo',
      'identificacion-aforo-montanera': 'Identificación Aforo Montanera',
      'nuevo-identificacion-aforo-montanera': 'Nuevo Identificación Aforo Montanera',
      'editar-identificacion-aforo-montanera': 'Editar Identificación Aforo Montanera',
      'entrada-montanera': 'Entrada Montanera',
      'nuevo-entrada-montanera': 'Nueva Entrada Montanera',
      'editar-entrada-montanera': 'Editar Entrada Montanera',
      'control-explotacion': 'Control Explotación',
      'nuevo-control-explotacion': 'Nuevo Control Explotación',
      'editar-control-explotacion': 'Editar Control Explotación',
    };

    // Buscar en el mapa o generar un label a partir del segmento
    if (labelMap[urlSegment]) {
      return labelMap[urlSegment];
    }

    // Si no está en el mapa, convertir el formato kebab-case a título
    return urlSegment
      .split('-')
      .map(word => word.charAt(0).toUpperCase() + word.slice(1))
      .join(' ');
  }
}
