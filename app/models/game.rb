class Game < ActiveRecord::Base
  has_many :values, :dependent => :destroy
  has_many :library_items
  has_many :users, :through => :library_items

  validates_uniqueness_of :upc
  validates_presence_of :title
  validates_presence_of :platform
end