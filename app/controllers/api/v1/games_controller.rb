class GamesController < ApplicationController
  def create
    Game.create(user1_id: params[:requester_id],
                user2_id: params[:receiver_id])
    render status: :created
  end
end
