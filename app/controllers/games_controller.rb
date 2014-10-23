class GamesController < ApplicationController
  def new
    @online_users = User.where('last_active_at >= ?', 5.minutes.ago)
  end

  def create
  end
end
