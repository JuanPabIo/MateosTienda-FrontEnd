import { Component } from '@angular/core';
import { UserStorageService } from './services/storage/user-storage.service';


interface SidenavToggle{
  screenWidth: number;
  collapsed: boolean;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent {
  title = 'Mateos Tienda';
 
 isSideNavCollapsed = false;
  screenWidth = 0;

  onToggleSideNav(data: SidenavToggle): void {
    this.screenWidth = data.screenWidth;
    this.isSideNavCollapsed = data.collapsed;
  }  
}
