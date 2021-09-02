import { Component, OnInit } from '@angular/core';
import { AppConfig } from '../utils/config';

declare var IntializeState: Function;
@Component({
  selector: 'app-block-bharat-map',
  templateUrl: './block-bharat-map.component.html',
  styleUrls: ['./block-bharat-map.component.css']
})
export class BlockBharatMapComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    IntializeState(AppConfig.StateURL,AppConfig.DistrictUrl,AppConfig.BlockURL,document.getElementById("map"));
  }

}
