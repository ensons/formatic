# frozen_string_literal: true

module Formatic
  # A search field backed by a JSON endpoint.
  class Search < ::Formatic::Base
    option :url
    option :record_name, as: :manual_record_name, optional: true
    option :exclude_ids, default: -> { [] }
    option :placeholder, as: :manual_placeholder, optional: true
    option :submit_on_click, default: -> { false }
    option :minimum_query_length, default: -> { 1 }
    option :test_mode, optional: true

    renders_one :selected_record
    renders_many :actions
    renders_one :scanner
    renders_one :add_record

    def record_name
      manual_record_name.presence || param_key
    end

    def query_input_id
      f.field_id(attribute_name)
    end

    def value_input_id
      "#{query_input_id}_search_value"
    end

    def results_id
      "#{query_input_id}_search_results"
    end

    def search_placeholder
      manual_placeholder.presence || "#{wrapper.placeholder} suchen..."
    end
  end
end
