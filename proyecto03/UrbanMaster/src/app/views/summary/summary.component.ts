import { Component, ViewEncapsulation } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TeleportService } from 'src/app/services/teleport.service';

@Component({
  selector: 'app-summary',
  templateUrl: './summary.component.html',
  styleUrls: ['./summary.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class SummaryComponent {

  name: string = "";
  summary: string = "";

  constructor (private API:TeleportService, private route: ActivatedRoute) {

    route.params.subscribe(params => {
      this.name = params['name']; 
    });

    API.getUrbanAreaScores(this.name).subscribe(response => {
      let json = response as any;
      this.summary = json["summary"] as string;
    });

  }
}
