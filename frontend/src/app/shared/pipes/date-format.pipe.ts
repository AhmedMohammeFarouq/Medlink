import { Pipe, PipeTransform } from '@angular/core';
import { DateUtil } from '../../core/utils/date.util';

@Pipe({
  name: 'dateFormat',
  standalone: true
})
export class DateFormatPipe implements PipeTransform {
  transform(value: string | Date | undefined | null, includeTime: boolean = false): string {
    return includeTime ? DateUtil.formatDateTime(value) : DateUtil.formatDate(value);
  }
}
