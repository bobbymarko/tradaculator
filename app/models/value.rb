class Value < ActiveRecord::Base
  belongs_to :game
#  include Mongoid::Document
#  include Mongoid::Timestamps
#  embedded_in :game
#  field :vendor 
#  field :value
  validates_presence_of :vendor
  validates_presence_of :value
  
  def self.recent
    where("values.created_at > ?", 30.minutes)
  end
end