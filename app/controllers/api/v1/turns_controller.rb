class TurnsController < ApplicationController
  def create
    Turn.create(performer_id: params[:performer_id],
                game_id: params[:game_id].
                row: params[:row].
                column: params[:column])
  end
end
