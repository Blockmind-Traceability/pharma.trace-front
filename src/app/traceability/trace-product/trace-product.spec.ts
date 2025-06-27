import { ComponentFixture, TestBed } from '@angular/core/testing';

import { TraceProduct } from './trace-product';

describe('TraceProduct', () => {
  let component: TraceProduct;
  let fixture: ComponentFixture<TraceProduct>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TraceProduct]
    })
    .compileComponents();

    fixture = TestBed.createComponent(TraceProduct);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
