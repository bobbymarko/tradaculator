source 'http://rubygems.org'

gem 'rails', '3.1.1.rc2'

# Bundle edge Rails instead:
# gem 'rails',     :git => 'git://github.com/rails/rails.git'

gem 'mysql2'

# Gems used only for assets and not required
# in production environments by default.
group :assets do
  gem 'sass-rails', "  ~> 3.1.0"
  gem 'coffee-rails', "~> 3.1.0"
  gem 'uglifier'
end

gem 'haml-rails'
gem 'jquery-rails'

gem 'remixr'
gem 'amazon_product'
gem 'json'
gem 'nokogiri'

gem 'hoe', '~> 1.5.1' #weird rubygems version issue
gem 'execjs' #javascript runtime requirement for assets precompiling
gem 'therubyracer' #javascript runtime requirement for assets precompiling

gem 'capistrano'
gem 'rack-cache'


# Use unicorn as the web server
# gem 'unicorn'

# Deploy with Capistrano
# gem 'capistrano'

# To use debugger
# gem 'ruby-debug19', :require => 'ruby-debug'

group :test do
  # Pretty printed test output
  gem 'turn', :require => false
end

group :stage, :production do
  gem 'memcache-client'
end