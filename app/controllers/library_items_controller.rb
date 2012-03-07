class LibraryItemsController < ApplicationController
  respond_to :html, :json, :js
  
  before_filter :authenticate_user!
  
  def index
    redirect_to user_path(current_user.username)
  end
  
  def show
    #@library_item = 
  end
  
  def toggle
    game_id = params[:game_id]
    if is_library_item?(game_id)
      @library_item = LibraryItem.find_by_game_id_and_user_id(game_id, current_user.id)
      if @library_item.destroy
        flash_message = "Removed from library."
        @library_item = {:deleted => true}
      end
    else
      @library_item = current_user.library_items.build(:game_id => game_id)    
      flash_message = "Removed from library." if @library_item.save
    end
    respond_with(@library_item) do |format|
      format.html {
        @game = Game.find_by_id(game_id)
        flash[:notice] = flash_message if flash_message
        redirect_to game_path(@game.upc)
      }
    end
    
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
      @library_item = LibraryItem.find_by_game_id_and_user_id(params[:game_id], current_user.id)
    else
      @library_item = LibraryItem.find_by_id(params[:id])
    end
    
    @library_item.destroy
#    respond_with(@library_item)  
  end
  
  private
  
  def is_library_item?(game_id)
    !current_user.games.where(:id => game_id).empty?
  end
  
end