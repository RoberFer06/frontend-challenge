import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import Swal, { SweetAlertIcon } from 'sweetalert2';
import { RegisterService } from '../register.service';

@Component({
  selector: 'app-register',
  templateUrl: './register.component.html',
  styleUrls: ['./register.component.css'],
})
export class RegisterComponent implements OnInit {
  form: FormGroup;
  loadingForm = false;

  constructor(formBuilder: FormBuilder, private registerUser: RegisterService) {
    this.form = formBuilder.group({
      firstName: ['', [Validators.required, Validators.maxLength(50)]],
      lastName: ['', [Validators.required, Validators.maxLength(50)]],
      phone: [
        '',
        [
          Validators.required,
          Validators.pattern('^[0-9]*$'),
          Validators.required,
          Validators.maxLength(10),
          Validators.required,
          Validators.minLength(5),
        ],
      ],
      email: [
        '',
        [Validators.required, Validators.email, Validators.maxLength(62)],
      ],
    });
  }

  ngOnInit(): void {}

  submit() {
    this.loadingForm = true;
    this.registerUser.registerUser(this.form.value).subscribe(
      (response) => {
        this.showDialog(
          `Registro correcto, token: ${response.token}`,
          'success'
        );
        this.loadingForm = false;
      },
      (error) => {
        this.showDialog(
          error.message || 'Error al comunicarse con el servidor',
          'error'
        );
        this.loadingForm = false;
      }
    );
  }

  showDialog(text: string, icon: SweetAlertIcon, confirm?: () => void) {
    Swal.fire({
      icon: icon,
      title: 'Front-End Challenge',
      text: text,
    }).then((result) => {
      if (result.isConfirmed) {
        if (confirm) {
          confirm();
        }
      }
    });
  }
}
