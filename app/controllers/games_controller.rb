class GamesController < ApplicationController
  def new
    @online_users = User.where('last_active_at >= ?', 5.minutes.ago)
                        .where.not(id: current_user.id)
  end

  def show
    game = Game.find(params[:id])
    render json: game
  end

  def invites
    render json: Game.where(receiver_id: current_user.id,
                            status: 0)
  end

  def confirm
    game = Game.find(params[:game_id])
    game.update_attributes(status: 1)
    render json: game
  end

  def create
    game = Game.create(sender_id: current_user.id,
                receiver_id: params[:receiver_id])
    render json: game
  end

  def destroy
    game = Game.find(params[:id])
    game.destroy
    render nothing: true
  end
end
