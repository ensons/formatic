import { SearchRecord } from 'formatic/search_record';
import { SearchRequests } from 'formatic/search_requests';
export class Search {
    constructor(el) {
        this.el = el;
        this.requests = new SearchRequests;
        this.choiceRecords = new Map();
        this.setupBindings();
    }
    setupBindings() {
        this.resultsContainer.addEventListener('click', (event) => {
            const receiver = event.target;
            const choice = receiver.closest('.js-formatic-search__choice');
            if (!choice)
                return;
            event.preventDefault();
            this.actionChoose(choice);
        });
        this.clearContainer?.addEventListener('click', (event) => {
            event.preventDefault();
            this.actionClear();
        });
        this.queryInput.addEventListener('input', (event) => {
            event.preventDefault();
            this.actionSearch();
        });
    }
    debounce(fn) {
        return () => {
            clearTimeout(this.timeoutId);
            this.timeoutId = setTimeout(() => fn(), 400);
        };
    }
    actionSearch() {
        this.guiWaitingForQuery();
        this.debounce(this.actionSearchNow.bind(this))();
    }
    actionSearchNow() {
        if (this.queryInput.value.length == 0) {
            this.resultsContainer.innerHTML = '';
            return;
        }
        this.guiSearchingRecords();
        this.requests.search(this.resourceUrl, this.queryInput.value, this.searchParams)
            .then(result => {
            if (result?.query != this.queryInput.value)
                return;
            return result.data.records.map((attributes) => new SearchRecord(attributes));
        }).then(records => {
            if (records)
                this.guiPopulateRecordChoices(records);
        }).catch(err => {
            console.warn(`Finding records failed: ${err}`);
            this.guiFailed();
        });
    }
    actionChoose(choice) {
        clearTimeout(this.timeoutId);
        this.requests.abort();
        const record = this.choiceRecords.get(choice);
        if (!record)
            throw new Error('No search result for the chosen element');
        this.guiChooseRecord(record);
    }
    actionClear() {
        clearTimeout(this.timeoutId);
        this.requests.abort();
        this.guiClear();
    }
    guiWaitingForQuery() {
        this.resultsContainer.textContent = 'Waiting for input...';
        this.guiMayNotAddNew();
    }
    guiSearchingRecords() {
        this.resultsContainer.textContent = 'Searching...';
        this.guiMayNotAddNew();
    }
    guiFailed() {
        this.choiceRecords.clear();
        this.resultsContainer.textContent = 'Search failed.';
        this.guiMayNotAddNew();
    }
    guiPopulateRecordChoices(records) {
        this.resultsContainer.innerHTML = records.map((record) => record.htmlForAutocomplete).join('');
        this.choiceRecords = this.choicesFor(records);
        if (records.length == 0)
            this.resultsContainer.textContent = 'No records found.';
        this.guiMayAddNew();
    }
    guiChooseRecord(record) {
        this.valueInput.value = record.recordId;
        this.selectedContainer.innerHTML = record.htmlForInput;
        this.resultsContainer.innerHTML = '';
        this.queryInput.value = '';
        this.choiceRecords.clear();
        this.guiMayNotAddNew();
        this.notifyValueChanged();
    }
    guiClear() {
        this.valueInput.value = '';
        this.selectedContainer.innerHTML = '';
        this.resultsContainer.innerHTML = '';
        this.queryInput.value = '';
        this.choiceRecords.clear();
        this.guiMayNotAddNew();
        this.notifyValueChanged();
    }
    guiMayAddNew() {
        this.addRecordContainer.hidden = false;
    }
    guiMayNotAddNew() {
        this.addRecordContainer.hidden = true;
    }
    notifyValueChanged() {
        this.valueInput.dispatchEvent(new Event('change', { bubbles: true }));
    }
    choicesFor(records) {
        const choices = Array.from(this.choices);
        if (choices.length != records.length) {
            throw new Error(`Expected ${records.length} .js-formatic-search__choice elements, found ${choices.length}`);
        }
        return new Map(choices.map((choice, index) => [choice, records[index]]));
    }
    get searchParams() {
        const params = {
            record_name: this.recordName,
            attribute_name: this.attributeName,
        };
        if (this.excludeIds)
            params.exclude_ids = this.excludeIds;
        return params;
    }
    get resourceUrl() {
        return this.resourceInput.value;
    }
    get recordName() {
        return this.recordNameInput.value;
    }
    get attributeName() {
        return this.attributeNameInput.value;
    }
    get excludeIds() {
        return this.excludeIdsInput.value;
    }
    get resourceInput() {
        return this.el.querySelector('.js-formatic-search__resource');
    }
    get recordNameInput() {
        return this.el.querySelector('.js-formatic-search__record-name');
    }
    get attributeNameInput() {
        return this.el.querySelector('.js-formatic-search__attribute-name');
    }
    get excludeIdsInput() {
        return this.el.querySelector('.js-formatic-search__exclude-ids');
    }
    get queryInput() {
        return this.el.querySelector('.js-formatic-search__query-input');
    }
    get valueInput() {
        return this.el.querySelector('.js-formatic-search__value');
    }
    get selectedContainer() {
        return this.el.querySelector('.js-formatic-search__selected');
    }
    get resultsContainer() {
        return this.el.querySelector('.js-formatic-search__results');
    }
    get choices() {
        return this.resultsContainer.querySelectorAll('.js-formatic-search__choice');
    }
    get addRecordContainer() {
        return this.el.querySelector('.js-formatic-search__add-record');
    }
    get clearContainer() {
        return this.el.querySelector('.js-formatic-search__clear');
    }
}
//# sourceMappingURL=search.js.map