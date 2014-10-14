class TurnsController < ApplicationController
  def last
    render json: Game.find(params[:game_id]).turns.last
  end

  def create
    Turn.create(performer_id: params[:performer_id],
                game_id: params[:game_id],
                row: params[:row],
                column: params[:column])
  end
end
