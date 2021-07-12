import { HttpHeaders } from "@angular/common/http";

export class ExclusionHeader {
    static addExclusionHeader(): { headers: HttpHeaders } {
        return { headers: new HttpHeaders({ exclude_authorization: 'true'}) }
    }
}