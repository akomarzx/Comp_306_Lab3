import { Component, Input, OnDestroy, OnInit, signal, WritableSignal } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Comment, Comments } from '../../../../models/Movies';
import { MatCardModule } from '@angular/material/card';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { UserSecurityService } from '../../../../services/user-security.service';
import { Observable } from 'rxjs';
import { MoviesService } from '../../service/movies.service';
import { AsyncPipe } from '@angular/common';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-movie-comment',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormField,
    MatInputModule,
    MatDividerModule,
    MatButtonModule,
    AsyncPipe,
    MatIconModule
  ],
  templateUrl: './movie-comment.component.html',
  styleUrl: './movie-comment.component.scss'
})
export class MovieCommentComponent implements OnInit, OnDestroy {

  #movieId!: number
  comments!: Observable<Comments>;
  commentForm: FormGroup;
  commentEditForm: FormGroup
  isCommentEditMode: WritableSignal<boolean>
  currentCommentIdBeingEdited: WritableSignal<number | null>

  @Input()
  set currentMovieId(id: number) {
    this.#movieId = id
  }

  constructor(private fb: FormBuilder, private userService: UserSecurityService, private movieService: MoviesService) {
    this.commentForm = this.fb.group({
      content: ['', Validators.required],
    });
    this.commentEditForm = this.fb.group({
      content: ['', Validators.required]
    })
    this.isCommentEditMode = signal(false)
    this.currentCommentIdBeingEdited = signal(null)
  }
  ngOnInit(): void {
    this.comments = this.movieService.getMovieCommentsById(this.currentMovieId)
  }

  ngOnDestroy(): void {
  }

  saveComment() {
    if (this.commentForm.valid) {
      let content: string
      let isEditMode = this.isCommentEditMode()

      if (isEditMode) {
        content = this.commentEditForm.get('content')?.value
        this.movieService.updateCommentByCommentId(this.currentCommentIdBeingEdited()!, content)
        this.isCommentEditMode.set(false)
        this.currentCommentIdBeingEdited.set(null)
      } else {
        content = this.commentForm.get('content')?.value
        const newComment: Comment = {
          id: Math.floor(Math.random() * 500),
          username: this.userService.currentUser?.username!,
          content: content,
          timestamp: new Date(),
        };
        this.movieService.addMovieComment(newComment)
        this.commentForm.reset();
        this.commentForm.get('content')?.setErrors(null)
      }
    }
  }

  editComment(comment: Comment) {
    this.currentCommentIdBeingEdited.set(comment.id)
    this.isCommentEditMode.set(true)
    this.commentEditForm.patchValue({ content: comment.content })
  }

  cancelEdit() {
    this.isCommentEditMode.set(false)
    this.currentCommentIdBeingEdited.set(null)
  }

  canEditComment(owner: string, timestamp: Date) {

    const now = new Date();
    const timeDifference = now.getTime() - timestamp.getTime();
    const hoursDifference = timeDifference / (1000 * 60 * 60); // Convert milliseconds to hours

    return (owner === this.userService.currentUser?.username) && (hoursDifference < 24)
  }
}