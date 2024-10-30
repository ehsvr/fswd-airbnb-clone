class ApplicationController < ActionController::Base
    private
  
    def current_user
        token = cookies.signed[:airbnb_session_token]
        session = Session.find_by(token: token)
        if session
            @current_user ||= User.find_by(id: session[:user_id]) if session[:user_id]
        else
            @current_user = nil
        end
    end
end
