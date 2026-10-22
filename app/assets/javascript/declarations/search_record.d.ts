export declare class SearchRecord {
    id: string | number;
    html_for_autocomplete: string;
    html_for_input: string;
    constructor(attributes: Partial<SearchRecord>);
    get recordId(): string;
    get htmlForAutocomplete(): string;
    get htmlForInput(): string;
}
