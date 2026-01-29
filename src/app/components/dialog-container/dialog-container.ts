import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { DialogService } from '../../services/dialog/dialog';

@Component({
  selector: 'app-dialog-container',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './dialog-container.html',
  styleUrl: './dialog-container.scss',
})
export class DialogContainer {
dialogService = inject(DialogService);
  inputValue = '';

  onConfirm() {
    const result = this.inputValue || true;
    this.dialogService.confirm(result);
    this.inputValue = '';
  }

  onCancel() {
    this.dialogService.cancel();
    this.inputValue = '';
  }
}