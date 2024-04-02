import { Component, OnInit } from '@angular/core';
import { AuthService } from 'src/app/services/auth/auth.service';

@Component({
  selector: 'app-prolife',
  templateUrl: './prolife.component.html',
  styleUrls: ['./prolife.component.scss']
})
export class ProlifeComponent implements OnInit{
  user: any = {}; 

  constructor(private authService: AuthService) { }

  ngOnInit(): void {

    
  }
}

