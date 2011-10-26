class Value < ActiveRecord::Base
  include ValuesHelper
  
  belongs_to :game
#  include Mongoid::Document
#  include Mongoid::Timestamps
#  embedded_in :game
#  field :vendor 
#  field :value
  validates_presence_of :vendor
  validates_presence_of :value
  default_scope order("vendor ASC, created_at DESC")
  
  
  def self.recent
    where("values.created_at > ?", 2.hours)
  end
  
  def value_as_currency
    currency value
  end
end