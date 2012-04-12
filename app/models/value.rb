class Value < ActiveRecord::Base
  include ValuesHelper
  
  belongs_to :game

  validates_presence_of :vendor
  validates_presence_of :value
  default_scope order("created_at DESC")
  
  
  def self.recent
    where("values.created_at > ?", 2.hours.ago)
  end
  
  def self.top_current_value
    order("created_at DESC, value DESC").limit(1)[0]
  end
  
  def self.top_current_value_from(vendor)
    where(:vendor => vendor).order("created_at DESC, value DESC").limit(1)[0]
  end
  
  def self.top_current_value_per_vendor(game)
    #order("created_at ASC, value ASC").group('vendor').limit(3)
    #order("created_at ASC, value ASC").limit(3).all(:select => 'DISTINCT vendor, value')
    find_by_sql("SELECT * FROM ( select * from `values` order by created_at desc ) as temp WHERE game_id = #{game.id} GROUP BY vendor ORDER BY `value` DESC LIMIT 3")
  end
  
  def self.latest
    first
  end
  
  def value_as_currency
    currency value
  end
  
  def value_as_decimal
    value.to_f/100
  end
end