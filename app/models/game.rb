class Game < ActiveRecord::Base
  has_many :turns, dependent: :destroy

  STATUS = {
    0 => 'not confirmed',
    1 => 'started',
    2 => 'finished'
  }
end
