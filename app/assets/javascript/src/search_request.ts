export interface SearchRecord {
  id: string | number
  label: string
  html_for_autocomplete: string
  html_for_input: string
}

interface SearchResponse {
  records: SearchRecord[]
}

export class SearchRequest {
  private controller: AbortController | null = null

  constructor(private el: HTMLElement) {}

  async search(query: string): Promise<SearchRecord[]> {
    this.cancel()
    this.controller = new AbortController()

    const response = await fetch(this.url(query), {
      headers: { Accept: 'application/json' },
      signal: this.controller.signal
    })
    if (!response.ok) throw new Error(response.statusText)

    const data = await response.json() as SearchResponse
    return data.records
  }

  cancel() {
    this.controller?.abort()
    this.controller = null
  }

  private url(query: string) {
    const url = new URL(this.el.dataset.url, document.baseURI)
    url.searchParams.set('query', query)
    url.searchParams.set('record_name', this.el.dataset.recordName)
    url.searchParams.set('attribute_name', this.el.dataset.attributeName)

    if (this.el.dataset.excludeIds) {
      url.searchParams.set('exclude_ids', this.el.dataset.excludeIds)
    }

    return url
  }
}
