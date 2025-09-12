import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'enumDisplay',
  standalone: true,
})
export class EnumDisplayPipe implements PipeTransform {
  transform(value: string, type: 'localizacionCrotal' | 'raza'): string {
    const mappings = {
      localizacionCrotal: {
        OREJAIZQ: 'Oreja izquierda',
        OREJADER: 'Oreja derecha',
        NO_DETERMINADA: 'No se indica',
      },
      raza: {
        IBERICA100: '100% Ibérico',
        IBERICA75: '75% Ibérico',
        NO_DETERMINADA: 'No se indica',
      },
    } as const;

    return mappings[type]?.[value as keyof typeof mappings[typeof type]] || value;
  }
}
