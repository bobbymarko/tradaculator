class Value
  include Mongoid::Document
  include Mongoid::Timestamps
  embedded_in :game
  field :vendor 
  field :value
  validates_presence_of :vendor
  validates_presence_of :value
end