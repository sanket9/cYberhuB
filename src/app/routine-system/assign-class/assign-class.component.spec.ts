import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { AssignClassComponent } from './assign-class.component';

describe('AssignClassComponent', () => {
  let component: AssignClassComponent;
  let fixture: ComponentFixture<AssignClassComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ AssignClassComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(AssignClassComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
