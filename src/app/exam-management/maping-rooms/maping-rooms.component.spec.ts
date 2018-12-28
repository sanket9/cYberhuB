import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { MapingRoomsComponent } from './maping-rooms.component';

describe('MapingRoomsComponent', () => {
  let component: MapingRoomsComponent;
  let fixture: ComponentFixture<MapingRoomsComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ MapingRoomsComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(MapingRoomsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
