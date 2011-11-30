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