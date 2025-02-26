import { Component, input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-login-form',
  imports: [CommonModule],
  templateUrl: './login-form.component.html',
  styleUrl: './login-form.component.css'
})
export class LoginFormComponent {
  message = input('');
  // Use { id: number, name: string } type
  list: any = input<any>([]);
  ngOnInit() {
    console.log('hello `login-form` component');
  }

  onButtonClick() {
    alert('You clicked the button!');
  }
}
