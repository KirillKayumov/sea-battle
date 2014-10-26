class GamesController < ApplicationController
  before_action :authenticate_user!

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

  def ready
    game = Game.find(params[:game_id])
    if current_user.id == game.sender_id
      game.update_attributes(sender_confirm: true)
    elsif current_user.id == game.receiver_id
      game.update_attributes(receiver_confirm: true)
    end

    if game.sender_confirm && game.receiver_confirm
      game.update_attributes(status: 2)
    end

    render json: game
  end

  def destroy
    game = Game.find(params[:id])
    game.destroy
    render nothing: true
  end

  def finish
    game = Game.find(params[:game_id])
    game.update_attributes(status: 3)

    if game.sender_id == current_user.id
      game.update_attributes(winner_id: receiver_id)
    else
      game.update_attributes(winner_id: sender_id)
    end

    render nothing: true
  end
end
