class User < ActiveRecord::Base
  devise :database_authenticatable,
         :registerable,
         :rememberable,
         :trackable,
         :validatable

  has_many :turns, dependent: :destroy
end
