Rails.application.routes.draw do
  root to: 'static_pages#home'
  get '/property/:id' => 'static_pages#property'
  get '/login' => 'static_pages#login'
  get '/signup' => 'static_pages#signup'
  get '/new' => 'static_pages#new'
  get '/properties/edit/:id' => 'static_pages#edit'
  namespace :api do
    resources :users, only: [:create]
    resources :sessions, only: [:create, :destroy]
    resources :properties, only: [:index, :show, :create, :update, :destroy]
    resources :bookings, only: [:create]
    resources :charges, only: [:create]
    get '/properties/:id/bookings' => 'bookings#get_property_bookings'
    get '/authenticated' => 'sessions#authenticated'
    get '/current_user' => 'users#current_user_info'
    # stripe webhook
    post '/charges/mark_complete' => 'charges#mark_complete'
  end
end