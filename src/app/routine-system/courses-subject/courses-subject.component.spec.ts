import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { CoursesSubjectComponent } from './courses-subject.component';

describe('CoursesSubjectComponent', () => {
  let component: CoursesSubjectComponent;
  let fixture: ComponentFixture<CoursesSubjectComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ CoursesSubjectComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(CoursesSubjectComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
