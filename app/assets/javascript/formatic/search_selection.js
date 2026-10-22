export class SearchSelection {
    constructor(queryInput, valueInput, selectedContainer) {
        this.queryInput = queryInput;
        this.valueInput = valueInput;
        this.selectedContainer = selectedContainer;
    }
    choose(record) {
        this.valueInput.value = String(record.id);
        this.selectedContainer.innerHTML = record.html_for_input;
        this.queryInput.value = '';
        this.valueInput.dispatchEvent(new Event('change', { bubbles: true }));
    }
    clear() {
        this.valueInput.value = '';
        this.selectedContainer.replaceChildren();
        this.queryInput.value = '';
        this.valueInput.dispatchEvent(new Event('change', { bubbles: true }));
    }
}
//# sourceMappingURL=search_selection.js.map