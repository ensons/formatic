# frozen_string_literal: true

module Formatic
  module Templates
    # Holds the ERB template for this component.
    module Search
      TEMPLATE = <<~ERB
        <%= render wrapper do |formatic_wrapper| %>
          <% formatic_wrapper.with_input do %>
            <div class="c-formatic-search js-formatic-search">
              <input type="hidden" class="js-formatic-search__resource" value="<%= url %>">
              <input type="hidden" class="js-formatic-search__record-name" value="<%= record_name %>">
              <input type="hidden" class="js-formatic-search__attribute-name" value="<%= attribute_name %>">
              <input type="hidden" class="js-formatic-search__exclude-ids" value="<%= exclude_ids.join(',') %>">

              <%= f.hidden_field attribute_name,
                                 id: nil,
                                 value:,
                                 class: 'js-formatic-search__value' %>

              <div class="c-formatic-search__selected js-formatic-search__selected">
                <%= selected_record %>
              </div>

              <div class="c-formatic-search__query">
                <%= helpers.tag.input type: 'search',
                                      id: query_input_id,
                                      placeholder: search_placeholder,
                                      autocomplete: 'off',
                                      class: 'js-formatic-search__query-input' %>
                <% if clear? %>
                  <div class="c-formatic-search__clear js-formatic-search__clear">
                    <%= clear %>
                  </div>
                <% end %>
              </div>

              <div class="c-formatic-search__results js-formatic-search__results"></div>
              <div class="c-formatic-search__add-record js-formatic-search__add-record" hidden><%= add_record %></div>
            </div>
          <% end %>
        <% end %>
      ERB

      private_constant :TEMPLATE

      def self.call
        TEMPLATE
      end
    end
  end
end
