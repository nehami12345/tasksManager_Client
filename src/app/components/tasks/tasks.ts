import { CommonModule } from '@angular/common';
import { Component, inject, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Task } from '../../models/task.model';
import { TaskService } from '../../services/task/task';
import { Comments } from '../comments/comments';
import { BehaviorSubject } from 'rxjs';
import { ToastService } from '../../services/toast/toast';
import { DialogService } from '../../services/dialog/dialog';
@Component({
  selector: 'app-tasks',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, Comments],
  templateUrl: './tasks.html',
  styleUrl: './tasks.scss',
})
export class Tasks implements OnInit {
  private tasksSubject = new BehaviorSubject<Task[]>([]);
  tasks$ = this.tasksSubject.asObservable();

  projectId!: number;
  newTaskTitle = '';
  newTaskDesc = '';
  newTaskPriority: 'low' | 'normal' | 'high' = 'normal';

  isLoading = true;
  activeTaskId: number | null = null;

  private taskService = inject(TaskService);
  private route = inject(ActivatedRoute);
  private toastService = inject(ToastService);
  private dialogService = inject(DialogService);


  editingTaskId: number | null = null;
  editedTask: Partial<Task> = {};

  filteredTasks: Task[] = [];
  searchTerm = '';
  filterPriority = 'all';

  isCreateFormVisible = false;
  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.projectId = Number(id);
      this.loadTasks();
    }

    this.tasksSubject.subscribe(tasks => {
      this.applyFilter();
    });
  }

  applyFilter() {
    let tasks = this.tasksSubject.value;

    if (this.searchTerm.trim()) {
      const term = this.searchTerm.toLowerCase().trim();
      tasks = tasks.filter(t =>
        t.title.toLowerCase().includes(term) ||
        (t.description && t.description.toLowerCase().includes(term))
      );
    }

    if (this.filterPriority !== 'all') {
      tasks = tasks.filter(t => t.priority === this.filterPriority);
    }

    this.filteredTasks = tasks;
  }
  get hasTasksInProject(): boolean {
    return this.tasksSubject.value.length > 0;
  }
  loadTasks() {
    this.isLoading = true;
    this.taskService.getTasks(this.projectId).subscribe({
      next: (data) => {
        this.tasksSubject.next(data);
        this.isLoading = false;
      },
      error: (err) => {
        console.error(err);
        this.isLoading = false;
      }
    });
  }

  createTask() {
    if (!this.newTaskTitle.trim()) return;

    const newTask: Partial<Task> = {
      ['projectId' as any]: this.projectId,
      title: this.newTaskTitle,
      description: this.newTaskDesc,
      status: 'todo',
      priority: this.newTaskPriority
    };

    this.taskService.createTask(newTask).subscribe({
      next: (createdTask) => {
        const currentTasks = this.tasksSubject.value;
        this.tasksSubject.next([...currentTasks, createdTask]);

        this.resetForm();
        this.toastService.show('Task created successfully!', 'success');
      },
      error: (err) => {
        this.toastService.show('Failed to create task.', 'error');
      }
    });
  }
  resetForm() {
    this.newTaskTitle = '';
    this.newTaskDesc = '';
    this.newTaskPriority = 'normal';
  }
  updateStatus(task: Task, newStatus: 'todo' | 'in_progress' | 'done') {
    if (task.status === newStatus) return;

    this.taskService.updateTask(task.id, { status: newStatus }).subscribe({
      next: (updatedTask) => {
        const currentTasks = this.tasksSubject.value;
        const updatedList = currentTasks.map(t =>
          t.id === task.id ? { ...t, status: newStatus } : t
        );
        this.tasksSubject.next(updatedList);
        this.toastService.show('Task updated', 'success');
      },
      error: () => this.toastService.show('Update failed', 'error')
    });
  }

  deleteTask(taskId: number) {
    this.dialogService.openConfirm(
      'Delete Task',
      'Are you sure you want to delete this task? This action cannot be undone.'
    ).subscribe((confirmed) => {

      if (confirmed) {
        this.taskService.deleteTask(taskId).subscribe({
          next: () => {
            const currentTasks = this.tasksSubject.value;
            this.tasksSubject.next(currentTasks.filter(t => t.id !== taskId));

            this.toastService.show('Task deleted', 'info');
          },
          error: () => this.toastService.show('Failed to delete task', 'error')
        });
      }
    });
  }
  toggleComments(taskId: number) {
    this.activeTaskId = this.activeTaskId === taskId ? null : taskId;
  }

  startEditing(task: Task) {
    this.editingTaskId = task.id;
    this.editedTask = { ...task };
  }
  cancelEditing() {
    this.editingTaskId = null;
    this.editedTask = {};
  }
  saveTask() {
    if (!this.editingTaskId || !this.editedTask.title?.trim()) return;

    this.taskService.updateTask(this.editingTaskId, this.editedTask).subscribe({
      next: (updatedTask) => {
        const currentTasks = this.tasksSubject.value;
        const updatedList = currentTasks.map(t =>
          t.id === updatedTask.id ? updatedTask : t
        );
        this.tasksSubject.next(updatedList);
        this.cancelEditing();
      },
      error: () => this.toastService.show('Failed to update status', 'error')
    });
  }
}