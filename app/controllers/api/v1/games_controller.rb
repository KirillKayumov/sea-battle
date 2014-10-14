class GamesController < ApplicationController
  # method for request new game
  def new
    Game.create(sender_id: params[:sender_id],
                receiver_id: params[:receiver_id])
  end

  # method for confirm and start new game, remove game from DB unless confirmed
  def create
    if params[:confirm] == 'true'
      game = Game.not_confirmed_game(params[:sender_id], params[:receiver_id])
      game.update_attributes(status: Game::STATUS.invert['started'])
    else
      game = Game.not_confirmed_game(params[:sender_id], params[:receiver_id])
      game.destroy
    end
  end
end
