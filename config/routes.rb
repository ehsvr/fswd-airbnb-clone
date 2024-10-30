Rails.application.routes.draw do
  root to: 'static_pages#home'
  get '/property/:id' => 'static_pages#property'
  get '/login' => 'static_pages#login'
  get '/signup' => 'static_pages#signup'
  get '/new' => 'static_pages#new'
  get '/properties/edit/:id' => 'static_pages#edit'
  get '/booking/:id/success' => 'static_pages#success'
  get '/profile' => 'static_pages#profile'
  namespace :api do
    resources :users, only: [:create]
    resources :sessions, only: [:create, :destroy]
    resources :properties, only: [:index, :show, :create, :update, :destroy]
    resources :bookings, only: [:create, :show]
    resources :charges, only: [:create]
    get '/properties/:id/bookings' => 'bookings#get_property_bookings'
    get 'booking/:id/success' => 'bookings#success'
    get '/authenticated' => 'sessions#authenticated'
    get '/current_user' => 'users#current_user_info'
    delete '/logout' => 'sessions#destroy'
    get '/users/:user_id/bookings' => 'bookings#per_user'
    # stripe webhook
    post '/charges/mark_complete' => 'charges#mark_complete'
  end
end