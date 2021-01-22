import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { map } from "rxjs/operators";
import { environment } from "src/environments/environment";
import { IncomeRangeResponse, IncomeRangeOption } from "../classes/income-range-response";
import { EndpointPaths } from "../endpoint-paths";

@Injectable({
    providedIn: 'root',
})
export class IncomeRangeService {
    constructor(
        private http: HttpClient
    ) { }

    getIncomeRanges(): Observable<IncomeRangeOption[]> {
        return this.http.get(environment.apiUrl + EndpointPaths.INCOME_RANGES).pipe(
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