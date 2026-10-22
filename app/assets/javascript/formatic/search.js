import { SearchRequest } from 'formatic/search_request';
import { SearchResults } from 'formatic/search_results';
import { SearchSelection } from 'formatic/search_selection';
export class Search {
    constructor(el) {
        this.el = el;
        this.queryInput = el.querySelector('.js-formatic-search__query-input');
        this.addRecordContainer = el.querySelector('.js-formatic-search__add-record');
        this.request = new SearchRequest(el);
        this.selection = new SearchSelection(this.queryInput, el.querySelector('.js-formatic-search__value'), el.querySelector('.js-formatic-search__selected'));
        this.results = new SearchResults(el.querySelector('.js-formatic-search__results'), (record) => this.chooseRecord(record));
        this.setupBindings();
    }
    setupBindings() {
        this.queryInput.addEventListener('input', () => this.search());
        this.el.addEventListener('click', (event) => this.onClick(event));
    }
    onClick(event) {
        if (!(event.target instanceof Element))
            return;
        if (!event.target.closest('.js-formatic-search__clear'))
            return;
        event.preventDefault();
        this.clearSelection();
    }
    search() {
        clearTimeout(this.timeoutId);
        this.request.cancel();
        const query = this.queryInput.value.trim();
        this.addRecordContainer.hidden = true;
        if (!query) {
            this.results.clear();
            return;
        }
        this.results.showStatus('Waiting for input...');
        this.timeoutId = setTimeout(() => this.searchNow(query), 400);
    }
    async searchNow(query) {
        this.results.showStatus('Searching...');
        try {
            const records = await this.request.search(query);
            if (query !== this.queryInput.value.trim())
                return;
            this.results.show(records);
            this.addRecordContainer.hidden = false;
        }
        catch (error) {
            if (error.name === 'AbortError')
                return;
            console.warn(`[Formatic] Search failed: ${error}`);
            this.results.showStatus('Search failed.');
        }
    }
    chooseRecord(record) {
        clearTimeout(this.timeoutId);
        this.request.cancel();
        this.selection.choose(record);
        this.results.clear();
        this.addRecordContainer.hidden = true;
    }
    clearSelection() {
        clearTimeout(this.timeoutId);
        this.request.cancel();
        this.selection.clear();
        this.results.clear();
        this.addRecordContainer.hidden = true;
    }
}
//# sourceMappingURL=search.js.map