import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageProductUnits } from './manage-product-units';

describe('ManageProductUnits', () => {
  let component: ManageProductUnits;
  let fixture: ComponentFixture<ManageProductUnits>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageProductUnits]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageProductUnits);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
