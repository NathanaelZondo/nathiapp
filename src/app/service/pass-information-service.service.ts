import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class PassInformationServiceService {
  profile = {};
  role
  getUser
  tournid;
  currentmatch =[];
  constructor() { }

matchdetails(match)
{
this.currentmatch =[];
this.currentmatch.push(match);
console.log(this.currentmatch)
return this.currentmatch;

}


}
