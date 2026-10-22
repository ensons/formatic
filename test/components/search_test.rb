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
        record_name: 'commander_model',
        exclude_ids: ['excluded-id'],
      )

      output = render_inline(component)
      query = output.at_css('.js-formatic-search__query-input')
      value = output.at_css('.js-formatic-search__value')

      assert_equal '/admin/commanders.json', output.at_css('.js-formatic-search__resource')['value']
      assert_equal 'commander_model', output.at_css('.js-formatic-search__record-name')['value']
      assert_equal 'commander_id', output.at_css('.js-formatic-search__attribute-name')['value']
      assert_equal 'excluded-id', output.at_css('.js-formatic-search__exclude-ids')['value']
      assert_equal f.field_id(:commander_id), query['id']
      assert_equal 'commander_id', value['name']
      assert_nil value['id']
    end

    test 'renders selected record markup' do
      f = TestFormBuilder.for(CommanderModel.new)
      component = Formatic::Search.new(
        f:,
        attribute_name: :commander_id,
        record_name: 'commander_model',
        url: '/commanders.json'
      )
      component.with_selected_record { 'Scooby' }

      output = render_inline(component)

      assert_equal 'Scooby', output.at_css('.js-formatic-search__selected').text.strip
    end

    test 'renders the clear action' do
      f = TestFormBuilder.for(CommanderModel.new)
      component = Formatic::Search.new(
        f:,
        attribute_name: :commander_id,
        record_name: 'commander_model',
        url: '/commanders.json'
      )
      component.with_clear { 'Clear selection' }

      output = render_inline(component)

      assert_equal 'Clear selection', output.at_css('.c-formatic-search__clear').text.strip
    end

    test 'renders add-record content hidden until search completes' do
      f = TestFormBuilder.for(CommanderModel.new)
      component = Formatic::Search.new(
        f:,
        attribute_name: :commander_id,
        record_name: 'commander_model',
        url: '/commanders.json'
      )
      component.with_add_record { 'New record' }

      output = render_inline(component)
      add_record = output.at_css('.js-formatic-search__add-record')

      refute_nil add_record['hidden']
      assert_equal 'New record', add_record.text.strip
    end
  end
end
