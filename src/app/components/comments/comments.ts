import { CommonModule } from '@angular/common';
import { Component, inject, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommentService } from '../../services/comment/comment';
import { Comment } from '../../models/comment.model';
import { BehaviorSubject } from 'rxjs';
import { ToastService } from '../../services/toast/toast';
@Component({
  selector: 'app-comments',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './comments.html',
  styleUrl: './comments.scss',
})
export class Comments implements OnChanges {
  @Input() taskId!: number;

  private commentsSubject = new BehaviorSubject<Comment[]>([]);
  comments$ = this.commentsSubject.asObservable();

  newCommentBody: string = '';
  isLoading: boolean = false;

  private commentService = inject(CommentService);
  private toastService = inject(ToastService);

  ngOnChanges(changes: SimpleChanges) {
    if (changes['taskId'] && this.taskId) {
      this.loadComments();
    }
  }
  loadComments() {
    this.isLoading = true;
    this.commentService.getComments(this.taskId).subscribe({
      next: (data) => {
        this.commentsSubject.next(data);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load comments', err);
        this.isLoading = false;
      }
    });
  }
  addComment() {
    if (!this.newCommentBody.trim()) return;

    this.commentService.addComment(this.taskId, this.newCommentBody).subscribe({
      next: (comment) => {
        const currentComments = this.commentsSubject.value;
        this.commentsSubject.next([...currentComments, comment]);

        this.newCommentBody = '';
        this.toastService.show('Comment posted', 'success');
      },
      error: (err) => this.toastService.show('Failed to post comment', 'error')
    });
  }
}