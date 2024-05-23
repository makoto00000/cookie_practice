Rails.application.routes.draw do
  namespace :api do
    namespace :v1 do
      get "csrf", to: "sessions#set_csrf_token"
      post "session", to: "sessions#set_session"
      get "session", to: "sessions#get_session"
      post "signup", to: "users#create"
      post "login", to: "sessions#login"
      delete "logout", to: "sessions#logout"
      get "user", to: "users#current_user"
      post "cookie", to: "sessions#post_cookie"
    end
  end
end
