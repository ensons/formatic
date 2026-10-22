export class SearchRequest {
    constructor(el) {
        this.el = el;
        this.controller = null;
    }
    async search(query) {
        this.cancel();
        this.controller = new AbortController();
        const response = await fetch(this.url(query), {
            headers: { Accept: 'application/json' },
            signal: this.controller.signal
        });
        if (!response.ok)
            throw new Error(response.statusText);
        const data = await response.json();
        return data.records;
    }
    cancel() {
        this.controller?.abort();
        this.controller = null;
    }
    url(query) {
        const url = new URL(this.el.dataset.url, document.baseURI);
        url.searchParams.set('query', query);
        url.searchParams.set('record_name', this.el.dataset.recordName);
        url.searchParams.set('attribute_name', this.el.dataset.attributeName);
        if (this.el.dataset.excludeIds) {
            url.searchParams.set('exclude_ids', this.el.dataset.excludeIds);
        }
        return url;
    }
}
//# sourceMappingURL=search_request.js.map