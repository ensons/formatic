# frozen_string_literal: true

require 'formatic/templates/search'

module Formatic
  # A search field backed by a JSON endpoint.
  class Search < ::Formatic::Base
    option :url
    option :record_name
    option :exclude_ids, default: -> { [] }
    option :placeholder, as: :manual_placeholder, optional: true

    renders_one :selected_record
    renders_one :clear
    renders_one :add_record

    erb_template(::Formatic::Templates::Search.call)

    def query_input_id
      f.field_id(attribute_name)
    end

    def search_placeholder
      manual_placeholder.presence || wrapper.placeholder
    end
  end
end
