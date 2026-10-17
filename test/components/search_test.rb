# frozen_string_literal: true

require 'test_helper'

class CommanderModel
  include ActiveModel::API

  attr_accessor :commander_id
end

module Formatic
  class SearchTest < ApplicationTest
    test 'renders the query and value inputs with search metadata' do
      f = TestFormBuilder.for(CommanderModel.new)
      component = Formatic::Search.new(
        f:,
        attribute_name: :commander_id,
        url: '/admin/commanders.json',
        exclude_ids: ['excluded-id'],
        test_mode: 'fake-qr'
      )

      output = render_inline(component)
      search = output.at_css('[data-formatic-search]')
      query = output.at_css('[data-formatic-search-query]')
      value = output.at_css('[data-formatic-search-value]')

      assert_equal '/admin/commanders.json', search['data-url']
      assert_equal 'commander_model', search['data-record-name']
      assert_equal 'commander_id', search['data-attribute-name']
      assert_equal 'excluded-id', search['data-exclude-ids']
      assert_equal 'fake-qr', search['data-test-mode']
      assert_equal f.field_id(:commander_id), query['id']
      assert_equal 'commander_id', value['name']
    end

    test 'renders selected record markup' do
      f = TestFormBuilder.for(CommanderModel.new)
      component = Formatic::Search.new(f:, attribute_name: :commander_id, url: '/commanders.json')
      component.with_selected_record { 'Scooby' }

      output = render_inline(component)

      assert_equal 'Scooby', output.at_css('[data-formatic-search-record]').text.strip
    end

    test 'renders every action' do
      f = TestFormBuilder.for(CommanderModel.new)
      component = Formatic::Search.new(f:, attribute_name: :commander_id, url: '/commanders.json')
      component.with_action { 'Keiner' }
      component.with_action { 'Other action' }

      output = render_inline(component)

      actions = output.at_css('.c-formatic-search__actions').text
      assert_includes actions, 'Keiner'
      assert_includes actions, 'Other action'
    end

    test 'renders add-record content hidden until search completes' do
      f = TestFormBuilder.for(CommanderModel.new)
      component = Formatic::Search.new(f:, attribute_name: :commander_id, url: '/commanders.json')
      component.with_add_record { 'New record' }

      output = render_inline(component)
      add_record = output.at_css('[data-formatic-search-add-record]')

      refute_nil add_record['hidden']
      assert_equal 'New record', add_record.text.strip
    end
  end
end
