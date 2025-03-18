import { Task } from './task.model';

export interface TaskPagination{
  content: Task[];
  pageNo:number;
  pageSize:number;
  totalElements:number;
  totalPages:number;
  last:number;
}
