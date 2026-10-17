export class Search {
  constructor(el) {
    this.el = el
    this.records = new Map()
    this.bindings()
    this.syncValue()
  }

  bindings() {
    this.queryInput.addEventListener('input', () => this.search())
    this.el.addEventListener('click', (event) => this.onClick(event))
  }

  onClick(event) {
    const target = event.target instanceof Element ? event.target : event.target.parentElement
    if (!target) return

    const favorite = target.closest('[data-formatic-search-favorite], .js-input-autocomplete-component__favorite')
    if (favorite) {
      event.preventDefault()
      this.queryInput.value = favorite.dataset.formaticSearchFavorite || 'favoriten'
      this.searchNow()
      return
    }

    const clear = target.closest('[data-formatic-search-clear], [data-formatic-search-remove], .js-input-autocomplete-input__remove')
    if (clear) {
      event.preventDefault()
      this.clearSelection()
      return
    }

    const canonical = target.closest('.js-input-autocomplete__canonical')
    if (canonical) {
      event.preventDefault()
      this.queryInput.value = canonical.dataset.query || ''
      this.searchNow()
      return
    }

    const choice = target.closest('[data-record-id], [data-formatic-search-choice]')
    if (!choice || !this.resultsContainer.contains(choice)) return

    event.preventDefault()
    this.chooseRecord(choice.dataset.recordId || choice.dataset.formaticSearchChoice)
  }

  search() {
    clearTimeout(this.timeoutId)

    const query = this.queryInput.value.trim()
    if (!query) {
      this.cancelSearch()
      this.resultsContainer.replaceChildren()
      this.updateAddRecord(false)
      this.queryInput.setAttribute('aria-expanded', 'false')
      return
    }

    this.resultsContainer.textContent = 'Warte auf Eingabe...'
    this.updateAddRecord(false)
    this.timeoutId = setTimeout(() => this.searchNow(), 400)
  }

  async searchNow() {
    clearTimeout(this.timeoutId)

    const query = this.queryInput.value.trim()
    this.updateAddRecord(false)
    if (!query) {
      this.resultsContainer.replaceChildren()
      return
    }

    const minimumLength = Number(this.el.dataset.formaticSearchMinimumQueryLength || 1)
    if (query.length < minimumLength) {
      this.resultsContainer.textContent = 'Warte auf Eingabe...'
      return
    }

    this.cancelSearch()
    this.controller = new AbortController()
    this.resultsContainer.textContent = 'Suche...'

    try {
      const response = await fetch(this.searchURL(query), {
        headers: { Accept: 'application/json' },
        signal: this.controller.signal
      })
      if (!response.ok) throw new Error(response.statusText)

      const data = await response.json()
      if (query !== this.queryInput.value.trim()) return

      const records = data.records || []
      this.records = new Map(records.map((record) => [String(record.id), record]))
      this.populateChoices(records)
    } catch (error) {
      if (error.name === 'AbortError') return
      console.warn(`[Formatic] Search failed: ${error}`)
      this.resultsContainer.textContent = 'Suche fehlgeschlagen.'
      this.queryInput.setAttribute('aria-expanded', 'false')
    }
  }

  searchURL(query) {
    const url = new URL(this.el.dataset.url, document.baseURI)
    url.searchParams.set('query', query)
    url.searchParams.set('record_name', this.el.dataset.recordName || '')
    url.searchParams.set('attribute_name', this.el.dataset.attributeName || '')

    if (this.el.dataset.excludeIds) {
      url.searchParams.set('exclude_ids', this.el.dataset.excludeIds)
    }

    return url
  }

  populateChoices(records) {
    this.resultsContainer.replaceChildren()

    records.forEach((record) => {
      if (record.html_for_autocomplete) {
        this.resultsContainer.insertAdjacentHTML('beforeend', record.html_for_autocomplete)
        return
      }

      const choice = document.createElement('button')
      choice.type = 'button'
      choice.dataset.formaticSearchChoice = record.id
      choice.textContent = record.label || String(record.id)
      this.resultsContainer.append(choice)
    })

    if (records.length === 0) this.resultsContainer.textContent = 'Nichts gefunden.'
    this.updateAddRecord(true)
    this.queryInput.setAttribute('aria-expanded', String(records.length > 0))
  }

  chooseRecord(id) {
    const record = this.records.get(String(id))
    if (!record) return

    this.valueInput.value = record.id
    this.selectedContainer.replaceChildren()

    if (record.html_for_input) {
      this.selectedContainer.insertAdjacentHTML('beforeend', record.html_for_input)
    } else {
      this.selectedContainer.textContent = record.label || String(record.id)
    }

    this.queryInput.value = ''
    this.resultsContainer.replaceChildren()
    this.updateAddRecord(false)
    this.queryInput.setAttribute('aria-expanded', 'false')
    this.valueInput.dispatchEvent(new Event('change', { bubbles: true }))

    if (this.submitOnClick) this.valueInput.form?.requestSubmit()
  }

  clearSelection() {
    this.valueInput.value = ''
    this.selectedContainer.replaceChildren()
    this.queryInput.value = ''
    this.resultsContainer.replaceChildren()
    this.updateAddRecord(false)
    this.queryInput.setAttribute('aria-expanded', 'false')
    this.valueInput.dispatchEvent(new Event('change', { bubbles: true }))

    if (this.submitOnClick) this.valueInput.form?.requestSubmit()
  }

  syncValue() {
    if (this.valueInput.value) return

    const selectedValue = this.selectedContainer.querySelector('input[type="hidden"]')
    if (selectedValue) this.valueInput.value = selectedValue.value
  }

  cancelSearch() {
    this.controller?.abort()
    this.controller = null
  }

  updateAddRecord(visible) {
    if (this.addRecordLink) this.addRecordLink.hidden = !visible
  }

  get queryInput() {
    return this.el.querySelector('[data-formatic-search-query], .js-input-autocomplete-component__query')
  }

  get valueInput() {
    return this.el.querySelector('[data-formatic-search-value]')
  }

  get selectedContainer() {
    return this.el.querySelector('[data-formatic-search-record], .js-input-autocomplete-component__record')
  }

  get resultsContainer() {
    return this.el.querySelector('[data-formatic-search-results], .js-input-autocomplete-component__autocompletes')
  }

  get addRecordLink() {
    return this.el.querySelector('[data-formatic-search-add-record], .js-input-autocomplete-component__add-record')
  }

  get submitOnClick() {
    return this.el.dataset.formaticSearchSubmitOnClick === 'true'
  }
}
