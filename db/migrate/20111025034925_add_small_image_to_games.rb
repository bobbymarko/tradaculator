class AddSmallImageToGames < ActiveRecord::Migration
  def change
    add_column :games, :small_image, :string
  end
end
