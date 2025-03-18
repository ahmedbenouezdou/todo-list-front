import {Component, Inject, OnInit} from '@angular/core';
import {MAT_DIALOG_DATA, MatDialogActions, MatDialogContent, MatDialogRef} from '@angular/material/dialog';
import { Task } from '../task-list/models/task.model';
import {DatePipe} from '@angular/common';
import { TaskService } from '../task-list/services/task.service';
@Component({
  selector: 'app-task-details-modal',
  standalone: true,
  imports: [
    MatDialogContent,
    MatDialogActions,
    DatePipe
  ],
  templateUrl: './task-details-modal.component.html',
  styleUrl: './task-details-modal.component.scss'
})
export class TaskDetailsModalComponent implements OnInit{

  task?: Task;
  error?: string;

  constructor(
    public dialogRef: MatDialogRef<TaskDetailsModalComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { id: number },
    private taskService: TaskService
  ) {}

  ngOnInit(): void {
    this.loadTaskDetails();
  }

  loadTaskDetails(): void {
    this.taskService.getTaskById(this.data.id).subscribe({
      next: (task) => (this.task = task),
      error: (err) => (this.error = 'Erreur lors du chargement des détails')
    });
  }

  close(): void {
    this.dialogRef.close();
  }
}
