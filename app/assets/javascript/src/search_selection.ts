import { SearchRecord } from 'formatic/search_request'

export class SearchSelection {
  constructor(
    private queryInput: HTMLInputElement,
    private valueInput: HTMLInputElement,
    private selectedContainer: HTMLElement
  ) {}

  choose(record: SearchRecord) {
    this.valueInput.value = String(record.id)
    this.selectedContainer.innerHTML = record.html_for_input
    this.queryInput.value = ''
    this.valueInput.dispatchEvent(new Event('change', { bubbles: true }))
  }

  clear() {
    this.valueInput.value = ''
    this.selectedContainer.replaceChildren()
    this.queryInput.value = ''
    this.valueInput.dispatchEvent(new Event('change', { bubbles: true }))
  }
}
