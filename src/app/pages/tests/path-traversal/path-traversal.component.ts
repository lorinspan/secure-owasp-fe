import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { PathTraversalService } from '../../../services/path-traversal.service';
import {firstValueFrom} from 'rxjs';

@Component({
  standalone: true,
  selector: 'app-path-traversal',
  imports: [CommonModule, FormsModule],
  templateUrl: './path-traversal.component.html',
  styleUrls: ['./path-traversal.component.css']
})
export class PathTraversalComponent implements OnInit {
  filePath: string = '';
  response: string = '';
  errorMessage: string = '';
  availableFiles: string[] = [];

  constructor(private pathTraversalService: PathTraversalService) {}

  ngOnInit() {
    this.loadAvailableFiles().then(() => console.log("Available files have been loaded!"));
  }

  async loadAvailableFiles() {
    try {
      this.availableFiles = await firstValueFrom(this.pathTraversalService.getAvailableFiles());
    } catch {
      this.errorMessage = "Could not load available files.\n";
    }
  }

  readFile() {
    this.response = '';
    this.errorMessage = '';

    this.pathTraversalService.readFile(this.filePath).subscribe(
      (data) => {
        if (data.content) {
          this.response = data.content;
        } else if (data.error) {
          this.errorMessage = data.error;
        }
      }
    );
  }

  selectFile(filename: string) {
    this.filePath = filename;
  }
}
