import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViewRutineComponent } from './view-rutine.component';

describe('ViewRutineComponent', () => {
  let component: ViewRutineComponent;
  let fixture: ComponentFixture<ViewRutineComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViewRutineComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViewRutineComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
