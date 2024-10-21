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

    def current_user_info
      user = current_user
      if user
        render json: { user: user }
      else
        render json: { error: 'User not found' }, status: :not_found
      end
      return
    end

    private

    def user_params
      params.require(:user).permit(:email, :password, :username)
    end
  end
end
