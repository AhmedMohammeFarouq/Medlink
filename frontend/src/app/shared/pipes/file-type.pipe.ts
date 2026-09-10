import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fileType',
  standalone: true
})
export class FileTypePipe implements PipeTransform {
  transform(filename: string | undefined | null): string {
    if (!filename) return 'FILE';
    const ext = filename.split('.').pop()?.toUpperCase() || 'FILE';
    return ext;
  }
}
