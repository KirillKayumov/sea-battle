class Game < ActiveRecord::Base
  has_many :turns, dependent: :destroy
end
