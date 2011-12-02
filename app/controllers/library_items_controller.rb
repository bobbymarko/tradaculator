class LibraryItemsController < ApplicationController
  respond_to :html, :json, :js
  
  def index
    @games = current_user.games
    respond_with(@games)
  end
    
  # POST /library_item
  def create
    @library_item = LibraryItem.new(:user_id => current_user.id, :game_id => params[:game_id])
    @library_item.save
    respond_with(@library_item, :location => root_url)  
  end
  
  def destroy
    @library_item = LibraryItem.where("game_id = ? AND user_id = ?", params[:game_id], current_user.id).first
    LibraryItem.destroy(@library_item.id)
    respond_with(@library_item, :location => root_url)  
  end
end