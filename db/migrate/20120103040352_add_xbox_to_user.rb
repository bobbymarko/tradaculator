class AddXboxToUser < ActiveRecord::Migration
  def change
    add_column :users, :xbox_live_name, :string
    add_column :users, :playstation_network_name, :string
  end
end