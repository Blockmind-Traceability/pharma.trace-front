import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ManageBatches } from './manage-batches';

describe('ManageBatches', () => {
  let component: ManageBatches;
  let fixture: ComponentFixture<ManageBatches>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ManageBatches]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ManageBatches);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
