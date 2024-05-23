class Api::V1::SessionsController < ApplicationController

  def set_csrf_token
    render json: { authenticity_token: form_authenticity_token }, status: :ok
    # response.set_header('X-CSRF-Token', form_authenticity_token)
  end

  def set_session
    session[:test] = "test_session"
    cookies[:test] = {
      value: "test_cookie",
      same_site: :none,
      secure: true,
      http_only: true,
    }
    render json: {session: session, cookie: cookies}, status: :ok
  end
  
  def get_session
    render json: {session: session, cookies: cookies}, status: :ok
  end

  def login
    @user = User.find_by(email: params[:session][:email].downcase)
    if @user&.authenticate(params[:session][:password])
      reset_session
      session[:user_id] = @user.id
      render json: {user: @user}, status: :ok
    else
      render json: {error: @user.error}, status: :unprocessable_entity
    end
  end

  def logout
    reset_session
    render json: {}, status: :ok
  end

end
