import { SearchRecord } from 'formatic/search_record'
import { SearchRequests } from 'formatic/search_requests'

export class Search {
  private el: HTMLElement
  private requests: SearchRequests
  private choiceRecords: Map<HTMLElement, SearchRecord>
  private timeoutId: ReturnType<typeof setTimeout>

  constructor(el: HTMLElement) {
    this.el = el
    this.requests = new SearchRequests
    this.choiceRecords = new Map()
    this.setupBindings()
  }

  // Setup

  private setupBindings() {
    this.resultsContainer.addEventListener('click', (event) => {
      const receiver = <HTMLElement>event.target
      const choice = receiver.closest<HTMLElement>('.js-formatic-search__choice')
      if (!choice) return

      event.preventDefault()
      this.actionChoose(choice)
    })

    this.clearContainer?.addEventListener('click', (event) => {
      event.preventDefault()
      this.actionClear()
    })

    this.queryInput.addEventListener('input', (event) => {
      event.preventDefault()
      this.actionSearch()
    })
  }

  // Helpers

  private debounce(fn: Function) {
    return () => {
      clearTimeout(this.timeoutId)
      this.timeoutId = setTimeout(() => fn(), 400)
    }
  }

  // Actions

  private actionSearch() {
    this.guiWaitingForQuery()
    this.debounce(this.actionSearchNow.bind(this))()
  }

  private actionSearchNow() {
    if (this.queryInput.value.length == 0) {
      this.resultsContainer.innerHTML = ''
      return
    }

    this.guiSearchingRecords()
    this.requests.search(this.resourceUrl, this.queryInput.value, this.searchParams)
      .then(result => {
        // On multiple parallel ajax requests, the currently wanted response wins.
        if (result?.query != this.queryInput.value) return

        return result.data.records.map((attributes: any) => new SearchRecord(attributes))
      }).then(records => {
        if (records) this.guiPopulateRecordChoices(records)
      }).catch(err => {
        console.warn(`Finding records failed: ${err}`)
        this.guiFailed()
      })
  }

  private actionChoose(choice: HTMLElement) {
    clearTimeout(this.timeoutId)
    this.requests.abort()

    const record = this.choiceRecords.get(choice)
    if (!record) throw new Error('No search result for the chosen element')

    this.guiChooseRecord(record)
  }

  private actionClear() {
    clearTimeout(this.timeoutId)
    this.requests.abort()
    this.guiClear()
  }

  // GUI

  private guiWaitingForQuery() {
    this.resultsContainer.textContent = 'Waiting for input...'
    this.guiMayNotAddNew()
  }

  private guiSearchingRecords() {
    this.resultsContainer.textContent = 'Searching...'
    this.guiMayNotAddNew()
  }

  private guiFailed() {
    this.choiceRecords.clear()
    this.resultsContainer.textContent = 'Search failed.'
    this.guiMayNotAddNew()
  }

  private guiPopulateRecordChoices(records: Array<SearchRecord>) {
    this.resultsContainer.innerHTML = records.map((record) => record.htmlForAutocomplete).join('')
    this.choiceRecords = this.choicesFor(records)
    if (records.length == 0) this.resultsContainer.textContent = 'No records found.'
    this.guiMayAddNew()
  }

  private guiChooseRecord(record: SearchRecord) {
    this.valueInput.value = record.recordId
    this.selectedContainer.innerHTML = record.htmlForInput
    this.resultsContainer.innerHTML = ''
    this.queryInput.value = ''
    this.choiceRecords.clear()
    this.guiMayNotAddNew()
    this.notifyValueChanged()
  }

  private guiClear() {
    this.valueInput.value = ''
    this.selectedContainer.innerHTML = ''
    this.resultsContainer.innerHTML = ''
    this.queryInput.value = ''
    this.choiceRecords.clear()
    this.guiMayNotAddNew()
    this.notifyValueChanged()
  }

  private guiMayAddNew() {
    this.addRecordContainer.hidden = false
  }

  private guiMayNotAddNew() {
    this.addRecordContainer.hidden = true
  }

  private notifyValueChanged() {
    this.valueInput.dispatchEvent(new Event('change', { bubbles: true }))
  }

  private choicesFor(records: Array<SearchRecord>) {
    const choices = Array.from(this.choices)
    if (choices.length != records.length) {
      throw new Error(`Expected ${records.length} .js-formatic-search__choice elements, found ${choices.length}`)
    }

    return new Map(choices.map((choice, index) => [choice, records[index]]))
  }

  // Attributes

  private get searchParams() {
    const params: { [key: string]: string } = {
      record_name: this.recordName,
      attribute_name: this.attributeName,
    }
    if (this.excludeIds) params.exclude_ids = this.excludeIds
    return params
  }

  private get resourceUrl() {
    return this.resourceInput.value
  }

  private get recordName() {
    return this.recordNameInput.value
  }

  private get attributeName() {
    return this.attributeNameInput.value
  }

  private get excludeIds() {
    return this.excludeIdsInput.value
  }

  // DOM elements

  private get resourceInput() {
    return this.el.querySelector<HTMLInputElement>('.js-formatic-search__resource')
  }

  private get recordNameInput() {
    return this.el.querySelector<HTMLInputElement>('.js-formatic-search__record-name')
  }

  private get attributeNameInput() {
    return this.el.querySelector<HTMLInputElement>('.js-formatic-search__attribute-name')
  }

  private get excludeIdsInput() {
    return this.el.querySelector<HTMLInputElement>('.js-formatic-search__exclude-ids')
  }

  private get queryInput() {
    return this.el.querySelector<HTMLInputElement>('.js-formatic-search__query-input')
  }

  private get valueInput() {
    return this.el.querySelector<HTMLInputElement>('.js-formatic-search__value')
  }

  private get selectedContainer() {
    return this.el.querySelector<HTMLElement>('.js-formatic-search__selected')
  }

  private get resultsContainer() {
    return this.el.querySelector<HTMLElement>('.js-formatic-search__results')
  }

  private get choices() {
    return this.resultsContainer.querySelectorAll<HTMLElement>('.js-formatic-search__choice')
  }

  private get addRecordContainer() {
    return this.el.querySelector<HTMLElement>('.js-formatic-search__add-record')
  }

  private get clearContainer() {
    return this.el.querySelector<HTMLElement>('.js-formatic-search__clear')
  }
}
