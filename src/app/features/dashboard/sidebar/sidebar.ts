import { Component } from '@angular/core';
import { AuthService } from '../../../core/services/auth/auth';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  constructor(private auth: AuthService, private router: Router) {}

  async logout() {
    await this.auth.logout();
    await this.router.navigate(['/login']);
  }
}
