class Game < ActiveRecord::Base
  STATUS = {
    0 => 'not confirmed',
    1 => 'started',
    2 => 'finished'
  }

  def self.not_confirmed_game(requester_id, receiver_id)
    Game.where(user1_id: requester_id,
               user2_id: receiver_id,
               status: Game::STATUS.invert['not confirmed']).first
  end
end
