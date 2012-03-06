class CreateLibraryItems < ActiveRecord::Migration
  def change
    create_table :library_items do |t|
      t.integer :user_id
      t.integer :game_id

      t.timestamps
    end
  end
end
