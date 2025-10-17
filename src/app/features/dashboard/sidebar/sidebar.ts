import {
  Component,
  Input,
  Output,
  EventEmitter,
  HostBinding,
} from '@angular/core';
import { AuthService } from '../../../core/services/auth/auth';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive, CommonModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  @Input() isOpen = false;
  @Output() closeRequested = new EventEmitter<void>();

  @HostBinding('class.sidebar-open') get sidebarOpenClass() {
    return this.isOpen;
  }

  constructor(private auth: AuthService, private router: Router) {}

  async logout() {
    await this.auth.logout();
    await this.router.navigate(['/login']);
  }

  onLinkClick() {
    // Cerrar sidebar en mobile cuando se hace clic en un link
    this.closeRequested.emit();
  }
}
