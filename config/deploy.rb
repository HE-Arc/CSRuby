# config valid for current version and patch releases of Capistrano
lock "~> 3.12.1"

set :application, "CSRuby"
set :repo_url, "https://github.com/HE-Arc/CSRuby.git"

after 'deploy:publishing', 'uwsgi:restart'

namespace :uwsgi do
  desc 'Restart application'
  task :restart do
    on roles(:web) do |h|
      execute :sudo, 'sv reload uwsgi'
    end
  end
end

after 'deploy:updating', 'python:create_venv'

namespace :python do

  def venv_path
    File.join(shared_path, 'env')
  end

  desc 'Create venv'
  task :create_venv do
    on roles([:app, :web]) do |h|
      execute "python3.6 -m venv #{venv_path}"
      execute "source #{venv_path}/bin/activate"
      execute "#{venv_path}/bin/pip install -r #{release_path}/requirements.txt"
    end
  end
end

after 'deploy:published', 'node:install_packages'

namespace :node do
  desc 'Install node packages'
  task :install_packages do
    on roles(:web) do |h|
      execute "cd #{release_path}/csruby_frontend_app/ && npm install"
      execute "cd #{release_path}/csruby_frontend_app/ && npm run build"
    end
  end
end

after 'node:install_packages', 'static_files:deploy_static_files'

namespace :static_files do

  def venv_path
    File.join(shared_path, 'env')
  end

  desc 'Deploy static files'
  task :deploy_static_files do
    on roles(:web) do |h|
      execute "source #{venv_path}/bin/activate && cd #{release_path} && python manage.py collectstatic"
    end
  end
end

after 'static_files:deploy_static_files', 'migrations:run_migrations'

namespace :migrations do

  def venv_path
    File.join(shared_path, 'env')
  end

  desc 'Run migrations'
  task :run_migrations do
    on roles(:web) do |h|
      execute "source #{venv_path}/bin/activate && cd #{release_path} && python manage.py migrate"
    end
  end
end

# Default branch is :master
# ask :branch, `git rev-parse --abbrev-ref HEAD`.chomp

# Default deploy_to directory is /var/www/my_app_name
# set :deploy_to, "/var/www/my_app_name"

# Default value for :format is :airbrussh.
# set :format, :airbrussh

# You can configure the Airbrussh format using :format_options.
# These are the defaults.
# set :format_options, command_output: true, log_file: "log/capistrano.log", color: :auto, truncate: :auto

# Default value for :pty is false
# set :pty, true

# Default value for :linked_files is []
# append :linked_files, "config/database.yml"

# Default value for linked_dirs is []
# append :linked_dirs, "log", "tmp/pids", "tmp/cache", "tmp/sockets", "public/system"

# Default value for default_env is {}
# set :default_env, { path: "/opt/ruby/bin:$PATH" }

# Default value for local_user is ENV['USER']
# set :local_user, -> { `git config user.name`.chomp }

# Default value for keep_releases is 5
# set :keep_releases, 5

# Uncomment the following to require manually verifying the host key before first deploy.
# set :ssh_options, verify_host_key: :secure
