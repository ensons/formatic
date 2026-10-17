# Formatic

Opinionated ViewComponents for building forms.

## Usage

```ruby
# In Rails view
= render Formatic::String.new(f:, attribute_name: :first_name)
```

### Search fields

`Formatic::Search` renders a hidden value input and a query input for an endpoint
that returns JSON records. Each record should have an `id` and `label`; optional
`html_for_autocomplete` and `html_for_input` properties let the application
render its own result and selected-record markup. An optional `with_add_record`
slot stays hidden while searching and appears after a successful response, even
when there are no matches.

```ruby
= render Formatic::Search.new(f:, attribute_name: :commander_id,
                              url: admin_commanders_path(format: :json))
```

For Rack tests, include `Formatic::Testing::Capybara::Search` in a
`Capybara::RackTest` test class. `custom_select 'Bob', from: 'Users'` reads the
field's URL and parameter names, requests matching JSON directly, and fills the
hidden input with a result returned by that endpoint.

## Installation

Install the gem and add to the application's Gemfile by executing:

    bundle add formatic

If bundler is not being used to manage dependencies, install the gem by executing:

    gem install formatic

## Development

After checking out the repo, run `bin/setup` to install dependencies. Then, run `bin/ci` to run the tests. You can also run `bin/console` for an interactive prompt that will allow you to experiment.

## Testing

Run one test individually with:

    bundle exec ruby -I test test/lib/wrappers/test_required.rb

## Contributing

Bug reports and pull requests are welcome on GitHub at https://github.com/halo/formatic.

## License

The gem is available as open source under the terms of the [MIT License](https://opensource.org/licenses/MIT).
