import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { LoginFormComponent } from "./login-form/login-form.component";

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, LoginFormComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'Yo';
  mensaje = 'Hola Yo';
  articulos = [
    {
      id: 1,
      name: 'Articulo 1'
    },
    {
      id: 2,
      name: 'Articulo 2'
    },
    {
      id: 3,
      name: 'Articulo 3'
    },
    {
      id: 4,
      name: 'Articulo 4'
    }
 ]
}
