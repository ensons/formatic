export interface SearchRecord {
    id: string | number;
    label: string;
    html_for_autocomplete: string;
    html_for_input: string;
}
export declare class SearchRequest {
    private el;
    private controller;
    constructor(el: HTMLElement);
    search(query: string): Promise<SearchRecord[]>;
    cancel(): void;
    private url;
}
