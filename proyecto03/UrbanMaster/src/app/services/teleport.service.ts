import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TeleportService {

  constructor(private http: HttpClient) { }

  getUrbanAreaList() {
    return this.http.get("https://api.teleport.org/api/urban_areas/");
  }

  getUrbanAreaInfo(name: string) {
    return this.http.get(`https://api.teleport.org/api/urban_areas/slug:${name}/`);
  }

  getUrbanAreaScores(name: string) {
    return this.http.get(`https://api.teleport.org/api/urban_areas/slug:${name}/scores/`);
  }

  httpGET(link: string) {
    return this.http.get(link);
  }
}
