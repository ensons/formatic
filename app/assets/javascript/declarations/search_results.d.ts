import { SearchRecord } from 'formatic/search_request';
export declare class SearchResults {
    private el;
    private onSelect;
    private records;
    constructor(el: HTMLElement, onSelect: (record: SearchRecord) => void);
    show(records: SearchRecord[]): void;
    showStatus(message: string): void;
    clear(): void;
    private selectRecord;
}
