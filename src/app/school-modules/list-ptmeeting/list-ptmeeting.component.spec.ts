import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ListPtmeetingComponent } from './list-ptmeeting.component';

describe('ListPtmeetingComponent', () => {
  let component: ListPtmeetingComponent;
  let fixture: ComponentFixture<ListPtmeetingComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ListPtmeetingComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ListPtmeetingComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
