import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { PtmeatingComponent } from './ptmeating.component';

describe('PtmeatingComponent', () => {
  let component: PtmeatingComponent;
  let fixture: ComponentFixture<PtmeatingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ PtmeatingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(PtmeatingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
