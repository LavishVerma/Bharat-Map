import { Component, NgZone, OnInit } from '@angular/core';
import { AppConfig } from '../utils/config';

declare var IntializeState: Function;

@Component({
  selector: 'app-block-bharat-map',
  templateUrl: './block-bharat-map.component.html',
  styleUrls: ['./block-bharat-map.component.css']
})
export class BlockBharatMapComponent implements OnInit {

  StateUrl = AppConfig.StateURL;
  DistrictUrl = AppConfig.DistrictUrl;
  VillageUrl = AppConfig.VillageUrl;
  PanchayatUrl = AppConfig.PanchayatUrl;
  BlockUrl = AppConfig.BlockURL;
  constructor(private ngZone: NgZone) { }
  private applicationsByState: { [key: string]: any[] } = {};
  ngOnInit(): void {
    window['angularComponentReference']  = { component: this, zone: this.ngZone, loadAngularFunction: () => this.gotoState(), };
    window['angularComponentReference1']  = { component: this, zone: this.ngZone, loadAngularFunction: () => this.gotoDisrtict(), };
    console.log("Bharat map ts loaded");
    
    
    IntializeState(this.StateUrl,this.DistrictUrl,this.BlockUrl,this.PanchayatUrl,document.getElementById("map"),    );
  }  
  gotoDisrtict() {
    console.log("Inside ts back to District");
  }
  gotoState() {     
    console.log("Inside ts back to State");
    IntializeState(this.StateUrl,this.DistrictUrl,this.BlockUrl,document.getElementById("map"));
  }
  
}   
 
 

