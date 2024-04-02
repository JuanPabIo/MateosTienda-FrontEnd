import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ProlifeComponent } from './prolife.component';

describe('ProlifeComponent', () => {
  let component: ProlifeComponent;
  let fixture: ComponentFixture<ProlifeComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ProlifeComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ProlifeComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
