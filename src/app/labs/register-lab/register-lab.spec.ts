import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RegisterLab } from './register-lab';

describe('RegisterLab', () => {
  let component: RegisterLab;
  let fixture: ComponentFixture<RegisterLab>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RegisterLab]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RegisterLab);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
