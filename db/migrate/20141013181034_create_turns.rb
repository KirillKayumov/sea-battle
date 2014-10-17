class CreateTurns < ActiveRecord::Migration
  def change
    create_table :turns do |t|
      t.integer :performer_id
      t.integer :game_id
      t.integer :row
      t.integer :column

      t.timestamps
    end
  end
end
