# frozen_string_literal: true

require 'json'
require 'calls'

module Formatic
  module Testing
    module Capybara
      module Search
        def select_record_from_search(query, from:)
          SearchSelector.call(page: page, query:, from:)
        end

        class SearchSelector
          include Calls

          class SelectionError < ::StandardError; end

          option :page
          option :query
          option :from

          def call
            ensure_rack_test_driver!
            query_field = page.find_field(from)
            component = search_component(query_field)
            record = matching_record(search_records(component), query)

            raise SelectionError, "No result matching #{query.inspect} from #{from.inspect}" unless record

            apply_selection(component, query_field, record)
            record
          end

          private

          def ensure_rack_test_driver!
            require 'capybara/rack_test/driver'
            return if page.driver.is_a?(::Capybara::RackTest::Driver)

            raise ArgumentError, 'select_record_from_search requires Capybara RackTest'
          end

          def search_component(query_field)
            query_field.find(:xpath, 'ancestor::div[contains(@class, "js-formatic-search")][1]')
          end

          def search_records(component)
            response = search_request(component['data-url'], {
              query: query,
              record_name: component['data-record-name'],
              attribute_name: component['data-attribute-name'],
              exclude_ids: component['data-exclude-ids']
            })

            raise SelectionError, "Search for #{from.inspect} returned HTTP #{response.status}" unless response.ok?

            JSON.parse(response.body).fetch('records')
          end

          def search_request(url, params)
            browser = page.driver.browser
            browser.current_session.restore_state do
              browser.get(url, params, 'HTTP_ACCEPT' => 'application/json')
            end
          end

          def matching_record(records, query)
            records.find do |record|
              record.fetch('label').downcase.include?(query.downcase)
            end
          end

          def apply_selection(component, query_field, record)
            component.find('.js-formatic-search__value', visible: :all).set(record.fetch('id').to_s)
            selected = component.find('.js-formatic-search__selected', visible: :all)
            selected.native.inner_html = record.fetch('html_for_input')
            component.find('.js-formatic-search__results', visible: :all).native.inner_html = ''
            query_field.set('')
          end
        end
      end
    end
  end
end
