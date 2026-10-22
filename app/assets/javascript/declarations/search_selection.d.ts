import { SearchRecord } from 'formatic/search_request';
export declare class SearchSelection {
    private queryInput;
    private valueInput;
    private selectedContainer;
    constructor(queryInput: HTMLInputElement, valueInput: HTMLInputElement, selectedContainer: HTMLElement);
    choose(record: SearchRecord): void;
    clear(): void;
}
