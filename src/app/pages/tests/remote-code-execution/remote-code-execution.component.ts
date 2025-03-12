import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RemoteExecutionService } from '../../../services/remote-code-execution.service';
import {firstValueFrom} from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-remote-code-execution',
  imports: [CommonModule, FormsModule],
  templateUrl: './remote-code-execution.component.html',
  styleUrls: ['./remote-code-execution.component.css']
})
export class RemoteCodeExecutionComponent {
  command: string = '';
  response: string = '';
  errorMessage: string = '';

  constructor(private remoteExecService: RemoteExecutionService) {}

  async executeCommand() {
    this.response = '';
    this.errorMessage = '';

    if (!this.command.trim()) {
      this.errorMessage = "Please enter a command!";
      return;
    }

    try {
      const data = await firstValueFrom(this.remoteExecService.executeCommand(this.command));

      if (data.output) {
        this.response = data.output;
      } else if (data.error) {
        this.errorMessage = data.error;
      }
    } catch (error: any) {
      console.error("Error:", error);

      if (error.status === 403) {
        this.errorMessage = "You must be an administrator to run this command!";
      } else if (error.error?.error) {
        this.errorMessage = error.error.error;
      } else {
        this.errorMessage = "Unexpected error while executing command.";
      }
    }
  }
}
