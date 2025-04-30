import { Component } from '@angular/core';
import { NavbarComponent } from "../../../shared/navbar/navbar.component";
import { FooterComponent } from "../../../shared/footer/footer.component";

@Component({
  selector: 'app-landing-page',
  standalone: true,
  imports: [NavbarComponent, FooterComponent],
  templateUrl: './landing-page.component.html',
  styleUrl: './landing-page.component.css'
})
export class LandingPageComponent {

}
