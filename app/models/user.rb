class User < ActiveRecord::Base
  devise :database_authenticatable,
         :registerable,
         :rememberable,
         :validatable

  has_many :games, dependent: :destroy
  has_many :turns, dependent: :destroy

  validates :nickname, presence: true
end
