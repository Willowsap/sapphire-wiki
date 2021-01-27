import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-about',
  templateUrl: './about.component.html',
  styleUrls: ['./about.component.css']
})
export class AboutComponent implements OnInit {

  aboutSections = [
    'This is an e-learning tool created as an honors thesis project ' +
    'for Appalachian State University’s Computer Science Department, in partial ' +
    'fulfillment of the requirements for the degree of Bachelor of ' +
    'Science by Willow Emmeliine Sapphire.',

    'SapphireCS was created as an e-learning tool to address a need for easy, freely available ' +
    'learning materials. Usability was essential in the creation and design of a website ' +
    'specifically for supplementary materials: teachers needed a simple and user-friendly ' +
    'method to share course materials with students. The student interface allows ease of ' +
    'access, as it does not require enrollment. This makes learning a more universal endeavor, ' +
    'open to anyone at any scale of subject matter. SapphireCS makes it quick and easy for ' +
    'instructors to upload topics containing lectures and solvable problems.'
  ];
  closing = 'For inquiries, please contact Willow Sapphire at sapphirewe@appstate.edu';

  constructor() { }

  ngOnInit(): void {
  }

}
