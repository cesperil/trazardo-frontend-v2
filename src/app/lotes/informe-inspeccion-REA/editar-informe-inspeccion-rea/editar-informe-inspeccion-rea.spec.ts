import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarInformeInspeccionReaComponent } from './editar-informe-inspeccion-rea';

describe('EditarInformeInspeccionReaComponent', () => {
  let component: EditarInformeInspeccionReaComponent;
  let fixture: ComponentFixture<EditarInformeInspeccionReaComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarInformeInspeccionReaComponent]
    })
      .compileComponents();

    fixture = TestBed.createComponent(EditarInformeInspeccionReaComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
