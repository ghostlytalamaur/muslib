import { Directive, Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'log'
})
export class LogPipe implements PipeTransform {
    transform(value: any, prefix: string): any {
        if (prefix) {
            console.log(prefix, value);
        } else {
            console.log(value);
        }
        return value;
    }
}