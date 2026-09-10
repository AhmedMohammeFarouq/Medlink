import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent {
  @Input() placeholder: string = 'Search...';
  @Input() value: string = '';
  @Output() search = new EventEmitter<string>();

  onInput(val: string): void {
    this.value = val;
    this.search.emit(val);
  }

  clear(): void {
    this.value = '';
    this.search.emit('');
  }
}
