module GameHelper
  def is_library_item?(game_id)
    !current_user.games.where(:id => game_id).empty?
  end
end