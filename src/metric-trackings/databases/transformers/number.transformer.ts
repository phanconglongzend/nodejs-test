import { ValueTransformer } from 'typeorm';

export class NumberTransformer implements ValueTransformer {
  to(value: any): any {
    return value;
  }

  from(value: any): any {
    return Number(value);
  }
}
