import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http'; 
import { MaterialModules } from '../material-module';

import { ProfileDialogComponent } from './profile-dialog.component';

describe('ProfileDialogComponent', () => {
  let component: ProfileDialogComponent;
  let fixture: ComponentFixture<ProfileDialogComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
    imports: [
              HttpClientModule,
              MaterialModules/*,
              RouterTestingModule*/
            ],
      declarations: [ ProfileDialogComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ProfileDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
