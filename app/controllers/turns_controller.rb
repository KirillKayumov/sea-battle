class TurnsController < ApplicationController
  before_action :authenticate_user!

  def show
    turn = Turn.find(params[:id])
    render json: turn
  end

  def create
    turn = Turn.create(performer_id: current_user.id,
                       game_id: params[:game_id],
                       x: params[:x],
                       y: params[:y])
    render json: turn
  end

  def check
    turn = Turn.where(game_id: params[:game_id]).last
    render json: turn
  end

  def confirm
    turn = Turn.find(params[:turn_id])
    turn.update_attributes(status: params[:status])
    render json: turn
  end
end
