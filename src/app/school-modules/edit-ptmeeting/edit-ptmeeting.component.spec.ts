import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { EditPtmeetingComponent } from './edit-ptmeeting.component';

describe('EditPtmeetingComponent', () => {
  let component: EditPtmeetingComponent;
  let fixture: ComponentFixture<EditPtmeetingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ EditPtmeetingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(EditPtmeetingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
