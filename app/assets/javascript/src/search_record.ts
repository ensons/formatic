export class SearchRecord {
  id: string | number
  html_for_autocomplete: string
  html_for_input: string

  constructor(attributes: Partial<SearchRecord>) {
    Object.assign(this, attributes)
  }

  public get recordId() {
    if (this.id == null || this.id == '') throw new Error('Search record is missing id')
    return String(this.id)
  }

  public get htmlForAutocomplete() {
    if (!this.html_for_autocomplete) throw new Error('Search record is missing html_for_autocomplete')
    return this.html_for_autocomplete
  }

  public get htmlForInput() {
    if (!this.html_for_input) throw new Error('Search record is missing html_for_input')
    return this.html_for_input
  }
}
