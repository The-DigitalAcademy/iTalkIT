import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { Store } from '@ngrx/store';
import { AppState } from '../../store/app.state';
import * as AuthActions from '../../store/auth/auth.actions';
import * as AuthSelectors from '../../store/auth/auth.selectors';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css']
})
export class RegisterComponent {
    loading$ = this.store.select(AuthSelectors.selectIsLoading);
    error$ = this.store.select(AuthSelectors.selectError);

    registerForm = this.fb.group({
        fullName: ['', Validators.required],
        email: ['', [Validators.required, Validators.email]],
        password: ['', [Validators.required, Validators.minLength(6)]],
        confirmPassword: ['', Validators.required]
    }, { validators: this.passwordMatchValidator });

    constructor(
        private fb: FormBuilder,
        private authService: AuthService,
        private store: Store<AppState>,
        private router: Router
    ) {}

    passwordMatchValidator(form: any) {
        return form.get('password').value === form.get('confirmPassword').value
            ? null : { passwordMismatch: true };
    }

    onSubmit() {
        if (this.registerForm.invalid) return;

        const fullName = this.registerForm.get('fullName')!.value!;
        const email = this.registerForm.get('email')!.value!;
        const password = this.registerForm.get('password')!.value!;

        this.store.dispatch(
            AuthActions.register({ request: { fullName, email, password } })
        );
    }
}