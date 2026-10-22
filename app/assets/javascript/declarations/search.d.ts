export declare class Search {
    private el;
    private queryInput;
    private addRecordContainer;
    private request;
    private results;
    private selection;
    private timeoutId;
    constructor(el: HTMLElement);
    private setupBindings;
    private onClick;
    private search;
    private searchNow;
    private chooseRecord;
    private clearSelection;
}
