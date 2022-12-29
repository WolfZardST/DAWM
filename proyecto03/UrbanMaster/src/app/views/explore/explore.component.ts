import { Component, ViewChild } from '@angular/core';
import { GoogleMap } from '@angular/google-maps';
import { ActivatedRoute } from '@angular/router';
import { TeleportService } from 'src/app/services/teleport.service';

@Component({
  selector: 'app-explore',
  templateUrl: './explore.component.html',
  styleUrls: ['./explore.component.css']
})
export class ExploreComponent {

  @ViewChild(GoogleMap) map!: GoogleMap;

  name: string = "";
  latitude: number = 0.0;
  longitude: number = 0.0;

  constructor (private API:TeleportService, private route: ActivatedRoute) {

    route.params.subscribe(params => {
      this.name = params['name']; 
    });

    API.getUrbanAreaInfo(this.name).subscribe(response => {
      let json = response as any;

      API.httpGET(json["_links"]["ua:identifying-city"]["href"] as string).subscribe(nested_response => {
        let nested_json = nested_response as any;
        let latlon = nested_json['location']['latlon'];
        this.latitude = latlon['latitude'];
        this.longitude = latlon['longitude'];
        this.map.googleMap?.setCenter({ lat: this.latitude, lng: this.longitude });
      });
    });

  }
}
