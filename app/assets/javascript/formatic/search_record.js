export class SearchRecord {
    constructor(attributes) {
        Object.assign(this, attributes);
    }
    get recordId() {
        if (this.id == null || this.id == '')
            throw new Error('Search record is missing id');
        return String(this.id);
    }
    get htmlForAutocomplete() {
        if (!this.html_for_autocomplete)
            throw new Error('Search record is missing html_for_autocomplete');
        return this.html_for_autocomplete;
    }
    get htmlForInput() {
        if (!this.html_for_input)
            throw new Error('Search record is missing html_for_input');
        return this.html_for_input;
    }
}
//# sourceMappingURL=search_record.js.map