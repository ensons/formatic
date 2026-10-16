# frozen_string_literal: true

require 'rails/engine'
require 'dry-initializer'

module Formatic
  # :nodoc:
  class Engine < ::Rails::Engine
    isolate_namespace Formatic
    config.autoload_paths << root.join('lib')

    initializer 'formatic.importmap', before: 'importmap' do |app|
      app.config.importmap.paths << Engine.root.join('config/importmap.rb')
      # Watch JS changes in development
      app.config.importmap.cache_sweepers << Engine.root.join('app/assets/javascript')
    end

    initializer 'formatic.assets' do |app|
      app.config.assets.paths << Engine.root.join('app/javascript')
      app.config.assets.paths << Engine.root.join('app/stylesheets')
    end

    initializer 'formatic.vscode_snippets', group: :all do |app|
      app.config.after_initialize do
        vscode_dir = Rails.root.join('.vscode')
        next unless vscode_dir.directory?

        target = vscode_dir.join('formatic.code-snippets')
        source = Engine.root.join('vscode/formatic.code-snippets')

        VscodeSnippets.install(target, source)
      end
    end

    config.to_prepare do
      # Our Formatic components are subclasses of `ViewComponent::Base`.
      # When `ViewComponent::Base` is subclassed, two things happen:
      #
      #   1. Rails routes are included into the component
      #   2. The ViewComponent configuration is accessed
      #
      # So we can only require our components, once Rails has booted
      # AND the view_component gem has been fully initialized (configured).
      #
      # That's right here and now.
      ActiveSupport.on_load(:view_component) do
        require_relative '../../app/components/formatic/application_component'
        require_relative '../../app/components/formatic/wrapper'
        require_relative '../../app/components/formatic/base'

        # Components
        require_relative '../../app/components/formatic/toggle'
        require_relative '../../app/components/formatic/checklist'
        require_relative '../../app/components/formatic/date'
        require_relative '../../app/components/formatic/select'
        require_relative '../../app/components/formatic/search'
        require_relative '../../app/components/formatic/string'
        require_relative '../../app/components/formatic/stepper'
        require_relative '../../app/components/formatic/textarea'
        require_relative '../../app/components/formatic/time'
        require_relative '../../app/components/formatic/file'
        require_relative '../../app/components/formatic/files'
      end
    end
  end
end
