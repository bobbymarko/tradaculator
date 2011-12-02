class LibraryItem < ActiveRecord::Base
  belongs_to :user
  belongs_to :game
  
  validates :user_id, :presence => true
  validates :game_id, :presence => true, :uniqueness => {:scope => :user_id} # only one game per library
end
