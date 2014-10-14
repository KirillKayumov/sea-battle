class Game < ActiveRecord::Base
  STATUS = {
    0 => 'not confirmed',
    1 => 'started',
    2 => 'finished'
  }
end
