export class SearchResults {
    constructor(el, onSelect) {
        this.el = el;
        this.onSelect = onSelect;
        this.records = new Map();
        this.el.addEventListener('click', (event) => this.selectRecord(event));
    }
    show(records) {
        this.records = new Map(records.map((record) => [String(record.id), record]));
        this.el.innerHTML = records.map((record) => record.html_for_autocomplete).join('');
        if (records.length === 0)
            this.showStatus('No records found.');
    }
    showStatus(message) {
        this.records.clear();
        this.el.textContent = message;
    }
    clear() {
        this.records.clear();
        this.el.replaceChildren();
    }
    selectRecord(event) {
        if (!(event.target instanceof Element))
            return;
        const choice = event.target.closest('.js-formatic-search__choice');
        if (!choice || !this.el.contains(choice))
            return;
        event.preventDefault();
        const record = this.records.get(choice.dataset.recordId);
        if (!record)
            throw new Error(`No search result for record ${choice.dataset.recordId}`);
        this.onSelect(record);
    }
}
//# sourceMappingURL=search_results.js.map