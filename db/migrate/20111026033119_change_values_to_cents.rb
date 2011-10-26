class ChangeValuesToCents < ActiveRecord::Migration
  def change
    change_column :values, :value, :int
  end
end
