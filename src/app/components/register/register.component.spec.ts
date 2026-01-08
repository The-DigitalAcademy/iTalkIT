import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Store } from '@ngrx/store';
import { provideMockStore, MockStore } from '@ngrx/store/testing';
import { RegisterComponent } from './register.component';
import * as AuthActions from '../../store/auth/auth.actions';
import { By } from '@angular/platform-browser';

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let store: MockStore;

  const initialState = {
    auth: {
      loading: false,
      error: null
    }
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [RegisterComponent],
      imports: [ReactiveFormsModule],
      providers: [
        provideMockStore({ initialState })
      ]
    }).compileComponents();

    store = TestBed.inject(Store) as MockStore;
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the register component', () => {
    expect(component).toBeTruthy();
  });

  it('should have invalid form when empty', () => {
    expect(component.registerForm.valid).toBeFalse();
  });

  it('should validate password mismatch', () => {
    component.registerForm.setValue({
      fullName: 'John Doe',
      email: 'john@example.com',
      password: '123456',
      confirmPassword: 'abcdef'
    });

    expect(component.registerForm.errors).toEqual({ passwordMismatch: true });
  });

  it('should have valid form when passwords match', () => {
    component.registerForm.setValue({
      fullName: 'John Doe',
      email: 'john@example.com',
      password: '123456',
      confirmPassword: '123456'
    });

    expect(component.registerForm.valid).toBeTrue();
  });

  it('should dispatch register action on submit', () => {
    const dispatchSpy = spyOn(store, 'dispatch');

    component.registerForm.setValue({
      fullName: 'John Doe',
      email: 'john@example.com',
      password: '123456',
      confirmPassword: '123456'
    });

    component.onSubmit();

    expect(dispatchSpy).toHaveBeenCalledWith(
      AuthActions.register({
        fullName: 'John Doe',
        email: 'john@example.com',
        password: '123456'
      })
    );
  });

  it('should not dispatch action if form is invalid', () => {
    const dispatchSpy = spyOn(store, 'dispatch');

    component.onSubmit();

    expect(dispatchSpy).not.toHaveBeenCalled();
  });
});
