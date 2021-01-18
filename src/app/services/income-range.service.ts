import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { IncomeRangeResponse, IncomeRangeOption } from "../classes/income-range-response";

@Injectable({
    providedIn: 'root',
})
export class IncomeRangeService {
    constructor(
        private http: HttpClient
    ) { }

    getIncomeRanges(): Observable<IncomeRangeOption[]> {
        return this.http.get('http://localhost:8000/income-ranges/').pipe(
            map((ranges: IncomeRangeResponse[]) =>
                ranges.map(
                    (r) =>
                    ({
                        id: r.id,
                        fromTo: `${r.range_from}-${r.range_to}`,
                    } as IncomeRangeOption)
                )
            )
        );
    }
}