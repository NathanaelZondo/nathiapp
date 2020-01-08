import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-faqs',
  templateUrl: './faqs.page.html',
  styleUrls: ['./faqs.page.scss'],
})
export class FaqsPage implements OnInit {
  questionIndex = 0
  FAQS = [
    {
      question: 'Can i see information about players?',
      answer: 'Yes you can, and you dont have to log in to do so. Just select the tournament you wish to view and click the match that contais the team you want to see, after click on each team member under the lineups section to view their information.'
    },
    {
      question: 'How do i keep track of my application?',
      answer: "After applying for a tournament your application will have to be approved, you can see the message that appears after you've applied for the tournament. After payment, that tournament you applied for will be listed in your profile. You can go there and view its progress."
    },
    {
      question: 'How do I Apply?',
      answer: "To apply for a tournament you're going to have to login to the app or register any role will give you the ability to apply for a tournament"
    }
  ]
  constructor() { }

  ngOnInit() {
  }
  selectQuestion(i) {
    console.log(i);
    
  }
}
