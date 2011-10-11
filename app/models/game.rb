class Game
  include Mongoid::Document
  include Mongoid::Timestamps
  embeds_many :values
  field :upc
  field :title 
  field :platform
  field :image
  field :large_image
  validates_uniqueness_of :upc
  validates_presence_of :title
  validates_presence_of :platform
end