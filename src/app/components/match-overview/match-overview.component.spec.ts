import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MatchOverviewComponent } from './match-overview.component';

describe('MatchOverviewComponent', () => {
  let component: MatchOverviewComponent;
  let fixture: ComponentFixture<MatchOverviewComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [MatchOverviewComponent]
    });
    fixture = TestBed.createComponent(MatchOverviewComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
