import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ChooseNoticeTypeComponent } from './choose-notice-type.component';

describe('ChooseNoticeTypeComponent', () => {
  let component: ChooseNoticeTypeComponent;
  let fixture: ComponentFixture<ChooseNoticeTypeComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ChooseNoticeTypeComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ChooseNoticeTypeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
