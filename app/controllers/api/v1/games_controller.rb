class GamesController < ApplicationController
  def new
    Game.create(user1_id: params[:requester_id],
                user2_id: params[:receiver_id])
  end

  def create
    if params[:confirm] == 'true'
      game = not_confirmed_game
      game.update_attributes(status: Game::STATUS.invert['started'])
    else
      game = not_confirmed_game
      game.destroy
    end
  end

  private

  def not_confirmed_game
    Game.where(user1_id: params[:requester_id],
               user2_id: params[:receiver_id],
               status: Game::STATUS.invert['not confirmed']).first
  end
end
