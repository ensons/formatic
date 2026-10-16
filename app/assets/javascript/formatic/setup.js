import { Date } from 'formatic/date'
import { Select } from 'formatic/select'
import { Search } from 'formatic/search'
import { Stepper } from 'formatic/stepper'
import { String } from 'formatic/string'
import { Textarea } from 'formatic/textarea'
import { Toggle } from 'formatic/toggle'
import { FormaticFile } from 'formatic/file'

document.addEventListener('DOMContentLoaded', () => {
  document.querySelectorAll('[data-formatic-search="true"]').forEach((el) => {
    if (el.dataset.formaticSearchInitialized) return
    el.dataset.formaticSearchInitialized = 'true'
    new Search(el)
  })

  document.querySelectorAll('.js-formatic-file').forEach((el) => {
    console.debug('[Formatic] Instantiating File...')
    new FormaticFile(el)
  })

  document.querySelectorAll('.js-formatic-date').forEach((el) => {
    console.debug('[Formatic] Instantiating Date...')
    new Date(el)
  })

  document.querySelectorAll('.js-formatic-select').forEach((el) => {
    console.debug('[Formatic] Instantiating Select...')
    new Select(el)
  })

  document.querySelectorAll('.js-formatic-stepper').forEach((el) => {
    console.debug('[Formatic] Instantiating Stepper...')
    new Stepper(el)
  })

  document.querySelectorAll('.js-formatic-string').forEach((el) => {
    console.debug('[Formatic] Instantiating String...')
    new String(el)
  })

  document.querySelectorAll('.js-formatic-textarea').forEach((el) => {
    console.debug('[Formatic] Instantiating Textarea...')
    new Textarea(el)
  })

  document.querySelectorAll('.js-formatic-toggle').forEach((el) => {
    console.debug('[Formatic] Instantiating Toggle...')
    new Toggle(el)
  })
})
