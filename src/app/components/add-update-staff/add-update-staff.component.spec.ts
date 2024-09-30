import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddUpdateStaffComponent } from './add-update-staff.component';

describe('AddUpdateStaffComponent', () => {
  let component: AddUpdateStaffComponent;
  let fixture: ComponentFixture<AddUpdateStaffComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ AddUpdateStaffComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddUpdateStaffComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
