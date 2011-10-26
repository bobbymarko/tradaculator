class CreateGamesAndValues < ActiveRecord::Migration
  def change
    create_table :games do |t|
      t.string :title
      t.string :upc
      t.string :platform
      t.string :image
      t.string :large_image
      t.timestamps
    end
    
    create_table :values do |t|
      t.integer :game_id, :null => false
      t.string :vendor, :null => false
      t.decimal :value, :precision => 8, :scale => 2
      t.timestamps
    end
    
    add_index :games, :upc
  end
end