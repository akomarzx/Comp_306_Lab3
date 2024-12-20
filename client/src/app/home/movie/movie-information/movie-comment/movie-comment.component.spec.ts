import { ComponentFixture, TestBed } from '@angular/core/testing';

import { MovieCommentComponent } from './movie-comment.component';

describe('MovieCommentComponent', () => {
  let component: MovieCommentComponent;
  let fixture: ComponentFixture<MovieCommentComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MovieCommentComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(MovieCommentComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
