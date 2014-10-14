class CreateGames < ActiveRecord::Migration
  def change
    create_table :games do |t|
      t.integer :sender_id
      t.integer :receiver_id
      t.integer :winner_id, default: nil
      t.integer :status, default: 0

      t.timestamps
    end
  end
end
