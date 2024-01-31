import { ComponentFixture, TestBed } from '@angular/core/testing';

import { EditContractorComponent } from './edit-contractor.component';

describe('EditContractorComponent', () => {
  let component: EditContractorComponent;
  let fixture: ComponentFixture<EditContractorComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EditContractorComponent]
    });
    fixture = TestBed.createComponent(EditContractorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
