require_relative "boot"

require "rails"
require "active_model/railtie"
require "active_job/railtie"
require "active_record/railtie"
require "active_storage/engine"
require "action_controller/railtie"
require "action_mailer/railtie"
require "action_mailbox/engine"
require "action_text/engine"
require "action_view/railtie"
require "action_cable/engine"

Bundler.require(*Rails.groups)

module Api
  class Application < Rails::Application

    config.load_defaults 7.1

    config.autoload_lib(ignore: %w(assets tasks))

    config.api_only = true

    # Cookieを使う
    # CSRFトークンを使用するのにも必要 form_authenticity_tokenメソッドを使用する場合
    # → _csrf_tokenというkeyでsessionに保存している
    config.middleware.use ActionDispatch::Cookies
    
    # セッションを使う
    # Sessionに値をセットしようとすると、以下が発生
    # ActionDispatch::Request::Session::DisabledSessionError: Your application has sessions disabled. To write to the session you must first configure a session store
    config.middleware.use ActionDispatch::Session::CookieStore

    # フロントとバックエンドでドメイン名が異なる場合（本番環境のため）
    # https://www.hogehoge.com と https://api.hogehoge.com のような場合
    # デフォルトではlaxになっている → GETメソッドは許可して、POSTメソッドではCookieを送れない
    # :noneではないことに注意
    config.action_dispatch.cookies_same_site_protection = nil

  end
end
