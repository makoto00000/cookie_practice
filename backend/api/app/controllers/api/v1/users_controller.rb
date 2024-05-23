class Api::V1::UsersController < ApplicationController
  def create
    @user = User.new(user_params)
    if @user.save
      session[:user_id] = @user.id
      render json: {user: @user}, status: :ok
    else
      render json: {error: @user.error}, status: :unprocessable_entity
    end
  end

  def current_user
    user_id = session[:user_id]
    @user = User.find_by(id: user_id)
    if @user
      render json: {user: @user}, status: :ok
    else
      render json: {user: nil}, status: :ok
    end
  end

  private
  def user_params
    params.require(:user).permit(:name, :email, :password, :password_confirmation)
  end
end
