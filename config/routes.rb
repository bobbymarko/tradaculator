Tradaculator::Application.routes.draw do
  devise_for :users
  match 'gamers' => 'users#index', :via => :get, :as => 'users'
  match 'gamer/:username' => 'users#show', :via => :get, :as => 'user'
  
  #resources :library_items, :path => "/library"
  match 'library' => 'library_items#index', :via => :get, :as => 'library_items'
  match 'library' => 'library_items#destroy', :via => :delete, :as => 'library_items'
  match 'library' => 'library_items#create', :via => :post, :as => 'library_items'
  match 'library-toggle' => 'library_items#toggle', :via => :get, :as => 'library_toggle'
#  match 'library(/:id)' => 'library_items#show', :via => :get, :as => 'library_item'
  
  # match 'search(/page/:page)' => 'trade_in_values#show', :as => 'trade_in_values'
  match 'page/:page' => 'trade_in_values#show', :as => 'trade_in_values_no_query'
  match 'search(/:query(/page/:page))' => 'trade_in_values#show', :as => 'trade_in_values'
  match 'game/:upc' => 'games#show', :as => 'game'
#  match "search/:query" => "trade_in_values#index", :as => :trade_in_values, :via => [:post]
  # The priority is based upon order of creation:
  # first created -> highest priority.

  # Sample of regular route:
  #   match 'products/:id' => 'catalog#view'
  # Keep in mind you can assign values other than :controller and :action

  # Sample of named route:
  #   match 'products/:id/purchase' => 'catalog#purchase', :as => :purchase
  # This route can be invoked with purchase_url(:id => product.id)

  # Sample resource route (maps HTTP verbs to controller actions automatically):
  #   resources :products

  # Sample resource route with options:
  #   resources :products do
  #     member do
  #       get 'short'
  #       post 'toggle'
  #     end
  #
  #     collection do
  #       get 'sold'
  #     end
  #   end

  # Sample resource route with sub-resources:
  #   resources :products do
  #     resources :comments, :sales
  #     resource :seller
  #   end

  # Sample resource route with more complex sub-resources
  #   resources :products do
  #     resources :comments
  #     resources :sales do
  #       get 'recent', :on => :collection
  #     end
  #   end

  # Sample resource route within a namespace:
  #   namespace :admin do
  #     # Directs /admin/products/* to Admin::ProductsController
  #     # (app/controllers/admin/products_controller.rb)
  #     resources :products
  #   end

  # You can have the root of your site routed with "root"
  # just remember to delete public/index.html.
  root :to => 'trade_in_values#index'

  # See how all your routes lay out with "rake routes"

  # This is a legacy wild controller route that's not recommended for RESTful applications.
  # Note: This route will make all actions in every controller accessible via GET requests.
  # match ':controller(/:action(/:id(.:format)))'
end
