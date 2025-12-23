import { ComponentFixture, TestBed } from '@angular/core/testing';

import { NuevoInformeInspeccionREA } from './nuevo-informe-inspeccion-rea';

describe('NuevoInformeInspeccionREA', () => {
  let component: NuevoInformeInspeccionREA;
  let fixture: ComponentFixture<NuevoInformeInspeccionREA>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NuevoInformeInspeccionREA]
    })
    .compileComponents();

    fixture = TestBed.createComponent(NuevoInformeInspeccionREA);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
