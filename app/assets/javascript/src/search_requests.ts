// search(client, '/records.json', 'hello', { record_name: 'customer' })
// GET /records.json?record_name=customer&query=hello

export class SearchRequests {
  private previousController: AbortController
  private currentController: AbortController

  search(resource: string, searchterm: string, params: { [key: string]: string }): Promise<any> {
    const options = new Options
    options.resource = resource
    options.params = { ...params }
    options.params.query = searchterm
    return this.perform(options)
  }

  abort() {
    if (this.previousController) this.previousController.abort()
  }

  private perform(options: Options): Promise<any> {
    this.abortPreviousRequests()

    return new Promise((resolve, reject) => {
      if (options.params.query == '') return resolve(null)

      console.debug(`SearchRequests GET ${options.url}`)
      fetch(options.url, this.requestOptions)
        .then(response => this.parseResponse(response))
        .then(data => {
          resolve(new Result({ data: data, options: options, query: options.params.query }))
        }).catch(err => {
          this.fail(err, options, reject)
        })
    })
  }

  private abortPreviousRequests() {
    this.abort()
    this.currentController = new AbortController()
    this.previousController = this.currentController
  }

  private parseResponse(response: Response) {
    if (!response.ok) throw Error(response.statusText)
    return response.json()
  }

  private fail(err: any, options: Options, reject: (reason?: any) => void) {
    if (err.name == 'AbortError') {
      // A newer query started, then this request was aborted.
      // The promise stays unsettled so this response cannot overwrite the newer result.
      console.debug(`Cancelled GET ${options.url}`)
      return
    }

    console.debug(`Failed to GET ${options.url}`)
    reject(err)
  }

  private get requestOptions() {
    return {
      method: 'GET',
      headers: {
        'Accept': 'application/json',
        'Content-Type': 'application/json',
      },
      signal: this.currentController.signal,
    }
  }
}

class Options {
  resource: string
  params: { [key: string]: string }

  public get url() {
    const requestParams = new URLSearchParams()
    for (const [key, value] of Object.entries(this.params)) {
      requestParams.set(key, value)
    }
    const separator = this.resource.includes('?') ? '&' : '?'
    return this.resource + separator + requestParams
  }
}

class Result {
  data: any
  options: Options
  query: string

  constructor(attributes: Partial<Result>) {
    Object.assign(this, attributes)
  }
}
