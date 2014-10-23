class User < ActiveRecord::Base
  devise :database_authenticatable,
         :registerable,
         :rememberable,
         :trackable,
         :timeoutable,
         :validatable
end
