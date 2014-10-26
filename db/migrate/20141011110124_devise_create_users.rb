class DeviseCreateUsers < ActiveRecord::Migration
  def change
    create_table(:users) do |t|
      t.string :nickname

      ## Database authenticatable
      t.string :email,              null: false, default: ""
      t.string :encrypted_password, null: false, default: ""

      ## Rememberable
      t.datetime :remember_created_at

      t.datetime :last_active_at

      t.timestamps
    end

    add_index :users, :email,                unique: true
  end
end
