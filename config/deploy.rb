#cap staging deploy:check
#cap staging deploy
# or 
#cap production deploy:check
#cap production deploy

$:.unshift(File.expand_path('./lib', ENV['rvm_path']))
require 'rvm/capistrano'
set :rvm_ruby_string, 'ruby-1.9.2-p180@tradaculator'
set :rvm_type, :root

ssh_options[:forward_agent] = true

set :application, "tradaculator"

default_run_options[:pty] = true  # Must be set for the password prompt from git to work
set :scm, "git"
set :repository, "git@github.com:bobbymarko/tradaculator.git"  # Your clone URL
set :deploy_via, :remote_cache
set :branch, 'master'

set :user, "root"  # The server's user for deploys

desc "Run tasks in production enviroment."
task :production do
  set :rails_env, "production"
  set :deploy_to, "/srv/www/tradaculator.com"
  # Production nodes 
  role :app, "tradaculator.com"
  role :app, "tradaculator.com"
  role :db,  "tradaculator.com", :primary => true
end 

desc "Run tasks in staging enviroment."
task :staging do
  set :rails_env, "stage"
  set :deploy_to, "/srv/www/stage.tradaculator.com"
  # Staging nodes 
  role :web, "stage.tradaculator.com"
  role :app, "stage.tradaculator.com"
  role :db,  "stage.tradaculator.com", :primary=>true
end

# if you're still using the script/reaper helper you will need
# these http://github.com/rails/irs_process_scripts

# If you are using Passenger mod_rails uncomment this:
namespace :deploy do
   task :start do ; end
   task :stop do ; end
   task :restart, :roles => :app, :except => { :no_release => true } do
     run "#{try_sudo} touch #{File.join(current_path,'tmp','restart.txt')}"
   end
    desc "Symlinks the database.yml"
    task :symlink_db, :roles => :app do
      puts "deploying to #{deploy_to}"
      puts "releasing to #{release_path}"
      run "ln -fs #{deploy_to}/shared/config/database.yml #{release_path}/config/database.yml && ln -fs #{deploy_to}/shared/config/api_keys.yml #{release_path}/config/api_keys.yml"
    end
    desc "Compile asets"
    task :assets do
      run "cd #{release_path}; RAILS_ENV=#{rails_env} bundle exec rake assets:precompile"
    end
    desc "Change group to www-data" 
    task :chown_to_wwwdata, :roles => [ :app, :db, :web ] do 
            sudo "chown -R #{user}:www-data #{deploy_to}" 
    end 
end

after 'deploy:symlink', 'deploy:symlink_db'
after "deploy", "deploy:assets";
after "deploy", "deploy:chown_to_wwwdata";
#after 'deploy:update_code', 'deploy:precompile_assets'

after "deploy", "deploy:cleanup"