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
    },
    {
      question: "Will i know about new tournaments?",
      answer: "Yes the app will notify you when a new tournament is available to apply for, but only the team managers and vendors will be able to apply for it."
    },
     {
      question: "What happens if my team can't participate?",
      answer: "With a valid reason, your team can be postponed to a future date, meaning they will still be part of the tournament. However, if no reason is given, your team automatically forfeits the match and the oposing team moves on."
     }
  ]
  constructor() { }

  ngOnInit() {
  }
  selectQuestion(i) {
    console.log(i);
    
  }
}
