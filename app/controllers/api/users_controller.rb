module Api
  class UsersController < ApplicationController

    def create
      @user = User.new(user_params)
      if @user.save
        render 'api/users/create', status: :created
      else
        render json: { success: false }, status: :bad_request
      end
    end

    def current_user
      User.find_by(id: session[:user_id]) if session[:user_id]
    end

    def current_user_info
      user = current_user
      render json: { user: user }
    end

    private
    def user_params
      params.require(:user).permit(:email, :password, :username)
    end
  end
end