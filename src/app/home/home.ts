import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Header } from '../header/header';

@Component({
  selector: 'app-home',
  imports: [CommonModule, Header],
  templateUrl: './home.html',
  styleUrls: ['./home.css']
})
export class Home {
  
}
