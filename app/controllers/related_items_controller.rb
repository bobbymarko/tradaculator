class RelatedItemsController < ApplicationController
  respond_to :html, :json, :js
  
  def show
    @related_items = RelatedItem.find_by_amazon_id( params[:id] )
    respond_with(@related_items)
  end
  
end