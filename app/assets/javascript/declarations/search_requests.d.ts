export declare class SearchRequests {
    private previousController;
    private currentController;
    search(resource: string, searchterm: string, params: {
        [key: string]: string;
    }): Promise<any>;
    abort(): void;
    private perform;
    private abortPreviousRequests;
    private parseResponse;
    private fail;
    private get requestOptions();
}
