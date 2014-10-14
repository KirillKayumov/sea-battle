class Game < ActiveRecord::Base
  has_many :turns, dependent: :destroy

  STATUS = {
    0 => 'not confirmed',
    1 => 'started',
    2 => 'finished'
  }

  def self.not_confirmed_game(sender_id, receiver_id)
    Game.where(user1_id: sender_id,
               user2_id: receiver_id,
               status: Game::STATUS.invert['not confirmed']).first
  end
end
