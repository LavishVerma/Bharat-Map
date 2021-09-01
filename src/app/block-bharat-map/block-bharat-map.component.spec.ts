import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BlockBharatMapComponent } from './block-bharat-map.component';

describe('BlockBharatMapComponent', () => {
  let component: BlockBharatMapComponent;
  let fixture: ComponentFixture<BlockBharatMapComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ BlockBharatMapComponent ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(BlockBharatMapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
