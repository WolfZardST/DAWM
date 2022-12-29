import { Component } from '@angular/core';
import { DisplayableUrbanArea } from 'src/app/classes/displayable-urban-area';
import { TeleportService } from 'src/app/services/teleport.service';
import { MatIconRegistry } from '@angular/material/icon';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'app-picker',
  templateUrl: './picker.component.html',
  styleUrls: ['./picker.component.css']
})

export class PickerComponent {

  urban_areas: DisplayableUrbanArea[] = [];

  constructor(private API:TeleportService, private matIconRegistry: MatIconRegistry, private sanitizer: DomSanitizer) {

    matIconRegistry.addSvgIcon("search", sanitizer.bypassSecurityTrustResourceUrl("../../assets/icons/search.svg"));

    API.getUrbanAreaList().subscribe(response => {

      let json = response as any
      this.urban_areas = json["_links"]["ua:item"] as Array<DisplayableUrbanArea>;
      this.urban_areas.forEach(urban_area => {urban_area.display = true});
    });
    
  }

  onKey(event: any) {
    const inputValue = event.target.value.toUpperCase();
    
    this.urban_areas.forEach(urban_area => {
      urban_area.display = urban_area.name.toUpperCase().includes(inputValue);
    });
    
  }

}
