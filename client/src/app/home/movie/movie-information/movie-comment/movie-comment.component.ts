import { Component } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { Comment } from '../../../../models/Movies';
import { MatCardModule } from '@angular/material/card';
import { MatFormField } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatDividerModule } from '@angular/material/divider';
import { MatButtonModule } from '@angular/material/button';
import { UserSecurityService } from '../../../../services/user-security.service';

@Component({
  selector: 'app-movie-comment',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    MatCardModule,
    MatFormField,
    MatInputModule,
    MatDividerModule,
    MatButtonModule
  ],
  templateUrl: './movie-comment.component.html',
  styleUrl: './movie-comment.component.scss'
})
export class MovieCommentComponent {

  comments: Comment[] = [];
  commentForm: FormGroup;

  constructor(private fb: FormBuilder, private userService: UserSecurityService) {
    this.commentForm = this.fb.group({
      content: ['', Validators.required],
    });
  }

  addComment() {
    if (this.commentForm.valid) {
      const newComment: Comment = {
        username: this.userService.currentUser?.username!,
        content: this.commentForm.value.content,
        timestamp: new Date(),
      };
      this.comments.push(newComment);
      this.commentForm.reset();
      this.commentForm.markAsUntouched();
    }
  }
}