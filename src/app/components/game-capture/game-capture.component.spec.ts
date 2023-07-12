import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GameCaptureComponent } from './game-capture.component';

describe('GameCaptureComponent', () => {
  let component: GameCaptureComponent;
  let fixture: ComponentFixture<GameCaptureComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GameCaptureComponent]
    });
    fixture = TestBed.createComponent(GameCaptureComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
