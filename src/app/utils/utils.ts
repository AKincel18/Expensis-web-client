import { FormGroup } from "@angular/forms";

export abstract class Utils {         

    public static parseDate(date: Date): any {
        return `${date.getFullYear()}-${
          date.getMonth() + 1
        }-${date.getDate()}`;
    }

    public static parseDateToString(date: Date) : string{
        let myDate = new Date(date);
        let yearString = myDate.getFullYear().toString();
        let month = myDate.getMonth() + 1;
        let day = myDate.getDate();
        let monthString = ((month >= 10) ? month.toString() : `0${month.toString()}`);
        let dayString = ((day >= 10) ? day.toString() : `0${day.toString()}`);
        return `${dayString}.${monthString}.${yearString}`;
    }

    public static getFirstError(response: any): string {
        for (const prop of Object.keys(response) ) { 
            return response[prop];
        }
        return "Error";
    }
    
    public static repeatPasswordValidator(group: FormGroup) {
        const password = group.controls.password.value;
        const passwordConfirmation = group.controls.cofirmationPassword.value;
      
        return password === passwordConfirmation ? null : { passwordsNotEqual: true };
      }
}