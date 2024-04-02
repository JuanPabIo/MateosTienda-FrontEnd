import { Component, EventEmitter, HostListener, OnInit, Output } from '@angular/core';
import { adminData, loginData, navbarData } from './nav-data';
import { animate, keyframes, style, transition, trigger } from '@angular/animations';
import { UserStorageService } from '../services/storage/user-storage.service';
import { Router } from '@angular/router';

interface SidenavToggle{
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-sidenav',
  templateUrl: './sidenav.component.html',
  styleUrls: ['./sidenav.component.scss'],
  animations: [
    trigger('fadeInOut', [
      transition(':enter', [
        style({opacity: 0}),
        animate('350ms',
          style({opacity: 1})
        )
      ]),
      transition(':leave', [
        style({opacity: 1}),
        animate('350ms',
          style({opacity: 0})
        )
      ])
    ]),
  ]
})
export class SidenavComponent implements OnInit {
  isCustomerLoggedIn: boolean = UserStorageService.isCustomerLoggedIn();
  isAdminLoggedIn: boolean = UserStorageService.isAdminLoggedIn();
  ruta: string = "assets/img/logo/bars-solid.svg";
  @Output() onToggleSideNav: EventEmitter<SidenavToggle> = new EventEmitter();
  collapsed = false;
  screenWidth = 0;
  navData = navbarData;
  customerData = loginData;
  administrador = adminData;

  constructor(private router: Router) {}

  ngOnInit(): void {
    this.screenWidth = window.innerWidth;
    this.router.events.subscribe((event) => {
      this.isCustomerLoggedIn = UserStorageService.isCustomerLoggedIn();
      this.isAdminLoggedIn = UserStorageService.isAdminLoggedIn();
    });
  }

  @HostListener('window:resize', ['$event'])
  onResize(event: any) {
    this.screenWidth = window.innerWidth;
    if (this.screenWidth <= 768) {
      this.collapsed = false;
      this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth });
    }
  }

  handleNavigation(routeLink: string) {
    if (routeLink === 'logout') {
      this.logout();
    } else {
      this.router.navigate([routeLink]);
    }
  }

  toggleCollapse(): void {
    this.collapsed = !this.collapsed;
    this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth });
  }

  onMouseEnter(): void {
    if (this.screenWidth > 768) { 
      this.collapsed = true;
      this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth });
    }
  }

  onMouseLeave(): void {
    if (this.screenWidth > 768) { 
      this.collapsed = false;
      this.onToggleSideNav.emit({collapsed: this.collapsed, screenWidth: this.screenWidth });
    }
  }

  logout() { 
    UserStorageService.signOut();
    this.router.navigateByUrl('login');
  }
}