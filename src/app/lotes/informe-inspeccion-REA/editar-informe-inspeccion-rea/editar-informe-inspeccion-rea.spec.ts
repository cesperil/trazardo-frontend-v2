import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditarInformeInspeccionREA } from './editar-informe-inspeccion-rea';

describe('EditarInformeInspeccionREA', () => {
  let component: EditarInformeInspeccionREA;
  let fixture: ComponentFixture<EditarInformeInspeccionREA>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [EditarInformeInspeccionREA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(EditarInformeInspeccionREA);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
