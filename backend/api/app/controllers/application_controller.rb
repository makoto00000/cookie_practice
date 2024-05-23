class ApplicationController < ActionController::API

  # Cookiesを使うため
  include ActionController::Cookies

  # CSRF対策をするため
  include ActionController::RequestForgeryProtection
  protect_from_forgery with: :exception

  def create_token(user_id)
    payload = { user_id: }
    secret_key = Rails.application.credentials.secret_key_base
    JWT.encode(payload, secret_key)
  end

  def authenticate
    authorization_header = request.headers[:authorization]
    if authorization_header
      token = authorization_header.split[1]
      secret_key = Rails.application.credentials.secret_key_base

      begin
        decoded_token = JWT.decode(token, secret_key)
        @current_user = User.find(decoded_token[0]['user_id'])
      rescue ActiveRecord::RecordNotFound
        render_unauthorized
      rescue JWT::DecodeError
        render_unauthorized
      end

    else
      render_unauthorized
    end
  end

  def render_unauthorized
    render json: { error: 'Unauthorized' }, status: :unauthorized
  end

end
