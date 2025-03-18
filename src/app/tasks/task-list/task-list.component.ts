import {Component, OnInit, signal} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {TaskService} from './services/task.service';
import { MatTableModule } from '@angular/material/table';
import { MatPaginatorModule } from '@angular/material/paginator';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import {MatCardModule} from '@angular/material/card';
import {AddTaskModalComponent} from '../add-task-modal/add-task-modal.component';
import {MatDialog} from '@angular/material/dialog';
import {ConfirmDialogComponent} from '../confirm-dialog/confirm-dialog.component';
import { Task } from './models/task.model';
import {TaskDetailsModalComponent} from '../task-details-modal/task-details-modal.component';

@Component({
  selector: 'app-task-list',
  standalone: true,
  imports: [CommonModule,
    ReactiveFormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatButtonModule,
    MatInputModule,
    MatCardModule],
  templateUrl: './task-list.component.html',
  styleUrl: './task-list.component.scss'
})
export class TaskListComponent implements OnInit {
  taskForm: FormGroup;
  currentPage = signal(0);
  showPendingOnly = signal(false);

  constructor(private taskService: TaskService, private fb: FormBuilder, private dialog: MatDialog) {
    this.taskForm = this.fb.group({
      label: ['', Validators.required]
    });
  }

  ngOnInit(): void {
    this.loadTasks();
  }

  get tasks() {
    return this.taskService.tasks() || [];
  }

  get pageNo() {
    return this.taskService.pageNo();
  }

  get totalElements() {
    return this.taskService.totalElements();
  }

  get pageSize() {
    return this.taskService.pageSize();
  }

  get totalPages() {
    return this.taskService.totalPages();
  }

  get lastPage() {
    return this.taskService.lastPage();
  }

  get error() {
    return this.taskService.error();
  }

  loadTasks() {
    this.taskService.loadTasks(this.currentPage(), this.pageSize);
  }

  changePage(event: any) {
    this.currentPage.set(event.pageIndex);
    this.loadTasks();
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return date.toLocaleString(); // Ex: "17 mars 2024, 14:30"
  }

  // Ouvrir la modal pour ajouter une tâche
  openAddTaskModal(): void {
    const dialogRef = this.dialog.open(AddTaskModalComponent, {
      width: '400px'
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.taskService.addTask(result,this.showPendingOnly());
      }
    });
  }

  confirmToggleTask(task: Task): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { message: `Voulez-vous marquer cette tâche comme ${task.complete ? 'non complétée':'complétée'  } ?` }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.taskService.updateTaskStatus(task.id, !task.complete);
      }
    });
  }

  // Ouvrir la modal de confirmation pour supprimer une tâche
  confirmDeleteTask(id: number): void {
    const dialogRef = this.dialog.open(ConfirmDialogComponent, {
      width: '400px',
      data: { message: 'Êtes-vous sûr de vouloir supprimer cette tâche ?' }
    });

    dialogRef.afterClosed().subscribe(confirmed => {
      if (confirmed) {
        this.taskService.deleteTask(id);
      }
    });
  }


  togglePendingOnly() {
    this.showPendingOnly.set(!this.showPendingOnly());
    if(this.showPendingOnly()){
      this.taskService.pendingTasks(this.currentPage(), this.pageSize);
    }else{
      this.loadTasks();
    }
  }


  openTaskDetails(id: number): void {
    this.dialog.open(TaskDetailsModalComponent, {
      width: '400px',
      data: { id }
    });
  }
}
