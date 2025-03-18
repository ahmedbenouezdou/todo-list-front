import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Task } from '../models/task.model';
import {TaskPagination} from '../models/pagination-task.model';
import {Observable} from 'rxjs';


@Injectable({
  providedIn: 'root'
})
export class TaskService {
  private apiUrl = 'http://localhost:8080/tasks';

  // Signal pour stocker les tâches
  tasks = signal<Task[]>([]);
  pageNo = signal(0);
  pageSize = signal(5);
  totalElements = signal(0);
  totalPages = signal(0);
  lastPage = signal(false);
  error = signal<string | null>(null);

  constructor(private http: HttpClient) {}

// Charger les tâches avec pagination
  loadTasks(page: number = 0, size: number = 5) {
    this.http.get<TaskPagination>(`${this.apiUrl}/pagination?page=${page}&size=${size}`).subscribe({
      next: (data) => {
        this.tasks.set(data.content);
        this.pageNo.set(data.pageNo);
        this.pageSize.set(data.pageSize);
        this.totalElements.set(data.totalElements);
        this.totalPages.set(data.totalPages);
        this.lastPage.set(Boolean(data.last));
      },
      error: (err) => this.error.set(err.message)
    });
  }

  // Ajouter une tâche et rafraîchir la liste
  addTask(label: string,showPendingOnly:boolean) {
    this.http.post<Task>(`${this.apiUrl}?label=${label}`, {}).subscribe({
      next: () => {
        if(showPendingOnly){
          this.pendingTasks();
        }else{
          this.loadTasks();
        }
      },
      error: (err) => this.error.set(err.message)
    });
  }

  // Modifier le statut d'une tâche et rafraîchir la liste
  updateTaskStatus(id: number, complete: boolean) {
    this.http.put<Task>(`${this.apiUrl}/${id}/status?complete=${complete}`, {}).subscribe({
      next: () => this.loadTasks(this.pageNo(), this.pageSize()),
      error: (err) => this.error.set(err.message)
    });
  }

  // Supprimer une tâche
  deleteTask(id: number) {
    this.http.delete<void>(`${this.apiUrl}/${id}`).subscribe({
      next: () => this.loadTasks(this.pageNo(), this.pageSize()),
      error: (err) => this.error.set(err.message)
    });
  }

  pendingTasks(page: number = 0, size: number = 5) {
    this.http.get<TaskPagination>(`${this.apiUrl}/pending?page=${page}&size=${size}`).subscribe({
      next: (data) => {
        this.tasks.set(data.content);
        this.pageNo.set(data.pageNo);
        this.pageSize.set(data.pageSize);
        this.totalElements.set(data.totalElements);
        this.totalPages.set(data.totalPages);
        this.lastPage.set(Boolean(data.last));
      },
      error: (err) => this.error.set(err.message)
    });
  }

  getTaskById(id: number): Observable<Task> {
    return this.http.get<Task>(`${this.apiUrl}/${id}`);
  }

}
