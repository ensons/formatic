# frozen_string_literal: true

require 'json'
require 'nokogiri'
require 'capybara/rack_test'

module Formatic
  module Testing
    module Capybara
      # Rack-test helper for fields marked with `data-formatic-search`.
      module Search
        class SelectionError < ::StandardError; end

        def custom_select(query, from:)
          ensure_rack_test_driver!
          query_field = find_field(from)
          component = search_component(query_field)
          record = matching_record(search_records(component, query, from), query)

          raise SelectionError, "No result matching #{query.inspect} from #{from.inspect}" unless record

          apply_selection(component, query_field, record)

          record
        end

        private

        def ensure_rack_test_driver!
          return if page.driver.is_a?(::Capybara::RackTest::Driver)

          raise ArgumentError, 'custom_select requires Capybara RackTest'
        end

        def search_component(query_field)
          query_field.find(:xpath, 'ancestor::*[@data-formatic-search="true"][1]')
        end

        def apply_selection(component, query_field, record)
          component.find('[data-formatic-search-value]', visible: :all).set(record.fetch('id').to_s)
          selected = component.find('[data-formatic-search-record]', visible: :all)
          selected.native.inner_html = record['html_for_input'].to_s
          component.find('[data-formatic-search-results]', visible: :all).native.inner_html = ''
          query_field.set('')
        end

        def search_records(component, query, from)
          url = component['data-url']
          raise SelectionError, "No search URL for #{from.inspect}" if url.blank?

          response = search_request(url, {
            query:,
            record_name: component['data-record-name'],
            attribute_name: component['data-attribute-name'],
            exclude_ids: component['data-exclude-ids']
          }.compact)

          raise SelectionError, "Search for #{from.inspect} returned HTTP #{response.status}" unless response.ok?

          JSON.parse(response.body).fetch('records', [])
        end

        def search_request(url, params)
          browser = page.driver.browser
          browser.current_session.restore_state do
            browser.get(url, params, 'HTTP_ACCEPT' => 'application/json')
          end
        end

        def matching_record(records, query)
          records.find do |record|
            record_label(record).downcase.include?(query.to_s.downcase)
          end
        end

        def record_label(record)
          return record['label'].to_s if record['label'].present?

          ::Nokogiri::HTML.fragment(record['html_for_autocomplete'].to_s).text.squish
        end
      end
    end
  end
end
