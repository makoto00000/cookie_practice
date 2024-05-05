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
    config.middleware.use ActionDispatch::Cookies 

    # セッションを使う
    config.middleware.use ActionDispatch::Session::CookieStore

    # フロントとバックエンドでドメイン名が異なる場合（本番環境のため）
    # https://www.hogehoge.com と https://api.hogehoge.com のような場合
    config.action_dispatch.cookies_same_site_protection = :none
  end
end
