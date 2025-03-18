import { Component } from '@angular/core';
import {FormBuilder, FormGroup, FormsModule, ReactiveFormsModule, Validators} from '@angular/forms';
import {
  MatDialogActions,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle
} from '@angular/material/dialog';
import {MatFormField} from '@angular/material/form-field';
import {MatButtonModule} from '@angular/material/button';
import {MatInputModule} from '@angular/material/input';

@Component({
  selector: 'app-add-task-modal',
  standalone: true,
  imports: [ReactiveFormsModule,
    MatInputModule,MatFormField,
    FormsModule,
    MatButtonModule,
    MatDialogTitle,
    MatDialogContent,
    MatDialogActions],
  templateUrl: './add-task-modal.component.html',
  styleUrl: './add-task-modal.component.scss'
})
export class AddTaskModalComponent {
  taskForm: FormGroup;

  constructor(
    private dialogRef: MatDialogRef<AddTaskModalComponent>,
    private fb: FormBuilder
  ) {
    this.taskForm = this.fb.group({
      label: ['', Validators.required]
    });
  }

  // Fermer la modal
  close(): void {
    this.dialogRef.close();
  }

  // Soumettre le formulaire
  submit(): void {
    if (this.taskForm.valid) {
      this.dialogRef.close(this.taskForm.value.label);
    }
  }
}
