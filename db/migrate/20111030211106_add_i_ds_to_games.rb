class AddIDsToGames < ActiveRecord::Migration
  def change
    add_column :games, :amazon_id, :string
    add_column :games, :best_buy_id, :string
    add_column :games, :glyde_id, :string
  end
end
