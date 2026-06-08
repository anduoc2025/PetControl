import { ComponentFixture, TestBed } from '@angular/core/testing';
import { VaccinesPage } from './vaccines.page';

describe('VaccinesPage', () => {
  let component: VaccinesPage;
  let fixture: ComponentFixture<VaccinesPage>;

  beforeEach(() => {
    fixture = TestBed.createComponent(VaccinesPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
