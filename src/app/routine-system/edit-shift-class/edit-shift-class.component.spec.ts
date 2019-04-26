import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditShiftClassComponent } from './edit-shift-class.component';

describe('EditShiftClassComponent', () => {
  let component: EditShiftClassComponent;
  let fixture: ComponentFixture<EditShiftClassComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditShiftClassComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditShiftClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
