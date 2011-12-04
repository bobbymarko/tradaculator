class LibraryItemsController < ApplicationController
  respond_to :html, :json, :js
  
  before_filter :authenticate_user!
  
  def index
    @games = current_user.games
    respond_with(@games)
  end
  
  def show
    #@library_item = 
  end
    
  # POST /library_item
  def create
    @library_item = LibraryItem.new(:user_id => current_user.id, :game_id => params[:game_id])
    @library_item.save
  end
  
  def destroy
    #@library_item = current_user.games.where("library_items.game_id = ?", params[:game_id]).first
    #@library_item.destroy
    #@library_item = LibraryItem.where("game_id = ? AND user_id = ?", params[:game_id], current_user.id).first
#    LibraryItem.destroy(@library_item.id)
    if (params[:game_id])
      @library_item = LibraryItem.find_by_game_id(params[:game_id])
    else
      @library_item = LibraryItem.find_by_id(params[:id])
    end
    
    @library_item.destroy
#    respond_with(@library_item)  
  end
end