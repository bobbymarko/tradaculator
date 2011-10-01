module TradeInValuesHelper
  def next_page(query,page)
    if page
      "<div class='p'>#{link_to "Load More", trade_in_values_path(query,page), {:id=>"load_more"}}</div>".html_safe
    end
  end
  
  def sort_values(values)
    sorted = values.sorted_hash { |a, b|
      game_a = a[1][:value].gsub(/[\$\.]/,'').to_i rescue 0
      game_b =       b[1][:value].gsub(/[\$\.]/,'').to_i rescue 0
      logger.info(game_a, game_b)
      game_b <=> game_a
    }
  end
end
