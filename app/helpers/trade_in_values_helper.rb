module TradeInValuesHelper
  def next_page(query,page)
    if page
      link_to "Load More", trade_in_values_path(query,page), {:id=>"load_more"}
    end
  end
  
  def sort_values(values)
    sorted = values.sorted_hash { |a, b|
      game_a = a[1][:value].gsub(/[\$\.]/,'').to_i rescue 0
      game_b =       b[1][:value].gsub(/[\$\.]/,'').to_i rescue 0
      game_b <=> game_a
    }
  end
end
