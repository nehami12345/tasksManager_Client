import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { RouterLink } from '@angular/router';
import { BehaviorSubject } from 'rxjs';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task/task';
import { FormsModule } from '@angular/forms';
import { TaskFilterPipe } from '../../pipes/task-filter-pipe';
import { ToastService } from '../../services/toast/toast';
import { DialogService } from '../../services/dialog/dialog';

@Component({
  selector: 'app-all-tasks',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule, TaskFilterPipe],
  templateUrl: './all-tasks.html',
  styleUrl: './all-tasks.scss',
})
export class AllTasks {
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  tasks$ = this.tasksSubject.asObservable();

  isLoading = true;
  errorMsg = '';

  private taskService = inject(TaskService);
  private toastService = inject(ToastService);
  private dialogService = inject(DialogService);

  searchTerm = '';
  filterPriority = 'all';

  ngOnInit() {
    this.loadAllTasks();
  }

  loadAllTasks() {
    this.isLoading = true;

    this.taskService.getTasks().subscribe({
      next: (data) => {
        this.tasksSubject.next(data);
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.errorMsg = 'Failed to load tasks.';
        this.isLoading = false;
      }
    });
  }

  updateStatus(task: Task, newStatus: 'todo' | 'in_progress' | 'done') {
    this.taskService.updateTask(task.id, { status: newStatus }).subscribe({
      next: () => {
        const currentTasks = this.tasksSubject.value;
        const updatedList = currentTasks.map(t =>
          t.id === task.id ? { ...t, status: newStatus } : t
        );
        this.tasksSubject.next(updatedList);
        this.toastService.show('Task status updated', 'success');
      },
      error: () => this.toastService.show('Failed to update', 'error')
    });
  }

  deleteTask(taskId: number) {
    this.dialogService.openConfirm(
      'Delete Task',
      'Are you sure you want to delete this task?'
    ).subscribe((result) => {

      if (result) {
        this.taskService.deleteTask(taskId).subscribe({
          next: () => {
            const currentTasks = this.tasksSubject.value;
            this.tasksSubject.next(currentTasks.filter(t => t.id !== taskId));
            this.toastService.show('Task deleted', 'info');
          },
          error: () => this.toastService.show('Delete failed', 'error')
        });
      }
    });
  }

  get hasTasks(): boolean {
    return this.tasksSubject.value.length > 0;
  }
}