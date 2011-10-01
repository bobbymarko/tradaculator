class CreateTradeInValues < ActiveRecord::Migration
  def change
    create_table :trade_in_values do |t|

      t.timestamps
    end
  end
end
