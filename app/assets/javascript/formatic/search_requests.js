export class SearchRequests {
    search(resource, searchterm, params) {
        const options = new Options;
        options.resource = resource;
        options.params = { ...params };
        options.params.query = searchterm;
        return this.perform(options);
    }
    abort() {
        if (this.previousController)
            this.previousController.abort();
    }
    perform(options) {
        this.abortPreviousRequests();
        return new Promise((resolve, reject) => {
            if (options.params.query == '')
                return resolve(null);
            console.debug(`SearchRequests GET ${options.url}`);
            fetch(options.url, this.requestOptions)
                .then(response => this.parseResponse(response))
                .then(data => {
                resolve(new Result({ data: data, options: options, query: options.params.query }));
            }).catch(err => {
                this.fail(err, options, reject);
            });
        });
    }
    abortPreviousRequests() {
        this.abort();
        this.currentController = new AbortController();
        this.previousController = this.currentController;
    }
    parseResponse(response) {
        if (!response.ok)
            throw Error(response.statusText);
        return response.json();
    }
    fail(err, options, reject) {
        if (err.name == 'AbortError') {
            console.debug(`Cancelled GET ${options.url}`);
            return;
        }
        console.debug(`Failed to GET ${options.url}`);
        reject(err);
    }
    get requestOptions() {
        return {
            method: 'GET',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json',
            },
            signal: this.currentController.signal,
        };
    }
}
class Options {
    get url() {
        const requestParams = new URLSearchParams();
        for (const [key, value] of Object.entries(this.params)) {
            requestParams.set(key, value);
        }
        const separator = this.resource.includes('?') ? '&' : '?';
        return this.resource + separator + requestParams;
    }
}
class Result {
    constructor(attributes) {
        Object.assign(this, attributes);
    }
}
//# sourceMappingURL=search_requests.js.map