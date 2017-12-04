import { Component } from '@angular/core';
import { FormBuilder, FormGroup, FormControl, Validators } from '@angular/forms';
import { HttpClient } from '@angular/common/http';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  rForm: FormGroup;
  post:any; // A property for our submitted form
  
  name:string = '';
  email:string = '';
  contact:string = ''; 
  
  http: HttpClient;
  statusCode: number;
  statusStr:string = '';
  errorStr:string = '';
  
  nameAlert:string = 'You need to enter at least 3 characters from a-z.';
  emailAlert:string = 'You need to enter valid email address';
  contactAlert:string = 'You need to enter at least 10 digits from 0-9';
  
  
  constructor(private fb: FormBuilder, private httpClient:HttpClient) {

    this.rForm = fb.group({
      'name': [null, Validators.compose([Validators.required, Validators.minLength(3), CustomValidators.validateCharacters])],
	  'email': [null, Validators.email],
      'contact': [null, Validators.compose([Validators.required, Validators.minLength(10), CustomValidators.validateContact])],
    });
	
	this.http = httpClient;
  }
  
  addPost(post) {
	this.name = post.name;
	
	return this.http.post('http://localhost:3000/api/Y', {
      "name": post.name,
      "email": post.email,
      "contact": post.contact
    },{observe: 'response'})
      .subscribe(
        res => {
          //console.log(res);
		  if (res.status == 200) this.statusStr = "Form Submitted!";
		  else this.statusStr = "Error!";
        },
        err => {
          //console.log(err);
        }
      );
  }
  
}

const invalidCharacters = /[\d,.:&\/()+%'`@-]/;
const invalidContact = /[\D\s,.:&\/()+%'`@-]/;

export class CustomValidators extends Validators {

  static validateCharacters(control: FormControl) {
     
    // first check if the control has a value
    if (control.value && control.value.length > 0) {
       
      // match the control value against the regular expression
      const matches = control.value.match(invalidCharacters);
      
      // if there are matches return an object, else return null.
      return matches && matches.length? { invalid_characters: matches } : null;
    } else {
      return null;
    }
  }
  
  static validateContact(control: FormControl) {
     
    // first check if the control has a value
    if (control.value && control.value.length > 0) {
       
      // match the control value against the regular expression
      const matches = control.value.match(invalidContact);
      
      // if there are matches return an object, else return null.
      return matches && matches.length? { invalid_contacts: matches } : null;
    } else {
      return null;
    }
  }
}
