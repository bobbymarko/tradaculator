module GameHelper
  def is_library_item?(game_id)
    !current_user.games.where(:id => game_id).empty?
  end
  
  def current_library_item
    current_user.library_items.where(:game_id => @game.id).first
  end
end