import { Component, OnInit } from '@angular/core';
import { AppConfig } from '../utils/config';

declare var IntializeBlock: Function;
@Component({
  selector: 'app-block-bharat-map',
  templateUrl: './block-bharat-map.component.html',
  styleUrls: ['./block-bharat-map.component.css']
})
export class BlockBharatMapComponent implements OnInit {

  constructor() { }

  ngOnInit(): void {
    //IntializeBlock(AppConfig.);
  }

}
