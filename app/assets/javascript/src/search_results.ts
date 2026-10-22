import { SearchRecord } from 'formatic/search_request'

export class SearchResults {
  private records: Map<string, SearchRecord> = new Map()

  constructor(
    private el: HTMLElement,
    private onSelect: (record: SearchRecord) => void
  ) {
    this.el.addEventListener('click', (event) => this.selectRecord(event))
  }

  show(records: SearchRecord[]) {
    this.records = new Map(records.map((record) => [String(record.id), record]))
    this.el.innerHTML = records.map((record) => record.html_for_autocomplete).join('')

    if (records.length === 0) this.showStatus('No records found.')
  }

  showStatus(message: string) {
    this.records.clear()
    this.el.textContent = message
  }

  clear() {
    this.records.clear()
    this.el.replaceChildren()
  }

  private selectRecord(event: MouseEvent) {
    if (!(event.target instanceof Element)) return

    const choice = event.target.closest<HTMLElement>('.js-formatic-search__choice')
    if (!choice || !this.el.contains(choice)) return

    event.preventDefault()
    const record = this.records.get(choice.dataset.recordId)
    if (!record) throw new Error(`No search result for record ${choice.dataset.recordId}`)

    this.onSelect(record)
  }
}
