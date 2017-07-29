import { Component, OnInit } from '@angular/core';
import {Pupil} from '../pupil';
import {School} from '../school';

@Component({
  selector: 'app-login-success',
  templateUrl: './login-success.component.html',
  styleUrls: ['./login-success.component.css']
})
export class LoginSuccessComponent implements OnInit {

  pupil: Pupil;
  school: School;

  constructor() {
    const data = JSON.parse(localStorage.getItem('data'));
    console.warn('data from storage: ', data);
    this.pupil = new Pupil;
    this.pupil.firstName = data['pupil'].firstName;
    this.pupil.lastName = data['pupil'].lastName;
    this.school = new School;
    this.school.name = data['school'].name;
  }

  ngOnInit() {
  }

}