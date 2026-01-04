import { Component, AfterViewInit, inject } from '@angular/core';
import { AuthService } from '../../../core/services/auth/auth.service';
import { environment } from '../../../environments/environment';


@Component({
  selector: 'app-login',
  standalone: true,
  template: `
    <div class="login">
      <h2>Sign in</h2>
      <div id="google-btn"></div>
    </div>
  `,
})
export class LoginComponent implements AfterViewInit {
  private auth = inject(AuthService);

  ngAfterViewInit() {

  }
}
