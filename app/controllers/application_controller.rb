class ApplicationController < ActionController::Base
  # Prevent CSRF attacks by raising an exception.
  # For APIs, you may want to use :null_session instead.
  protect_from_forgery with: :exception

  before_action :record_user_activity

  def after_sign_in_path_for(resource)
    new_game_path
  end

  def after_sign_up_path_for(resource)
    new_game_path
  end

  def after_sign_out_path_for(resource)
    root_path
  end

  private

  def record_user_activity
    if current_user
      current_user.update_attributes(last_active_at: Time.now)
    end
  end
end
