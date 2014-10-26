class User < ActiveRecord::Base
  devise :database_authenticatable,
         :registerable,
         :rememberable,
         :validatable

  has_many :turns, dependent: :destroy

  validates :nickname, presence: true

  def games
    Game.where('sender_id = ? OR receiver_id = ?', id, id)
        .where(status: 3)
  end

  def winned_games
    games.where(winner_id: id)
  end
end
