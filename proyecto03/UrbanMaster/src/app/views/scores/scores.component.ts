import { Component } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-scores',
  templateUrl: './scores.component.html',
  styleUrls: ['./scores.component.css']
})
export class ScoresComponent {

  link: SafeResourceUrl = "";
  name: string = "";
  selected_topic: string = "";
  topics: string[] = ["Scores", "Costs", "Salaries", "Crime", "Tolerance"];

  constructor (private route: ActivatedRoute, private sanitizer: DomSanitizer) {

    route.params.subscribe(params => {
      this.name = params['name']; 
    });

    this.selected_topic = this.topics[0];
    this.updateLink();
  }

  updateLink() {
    this.link = this.sanitizer.bypassSecurityTrustResourceUrl(`https://teleport.org/cities/${ this.name }/widget/${ this.selected_topic.toLowerCase() }/?currency=USD&citySwitcher=false`);
  }
}
