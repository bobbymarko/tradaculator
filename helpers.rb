def currency(number, opts = {})
  return if number.to_s.empty?

  unit      = opts[:unit]      || '$'
  precision = opts[:precision] || 2
  separator = opts[:separator] || ', '

  ret = "%s%.#{Integer(precision)}f" % [unit,number]
  parts = ret.split('.')
  parts[0].gsub!(/(\d)(?=(\d\d\d)+(?!\d))/, "\\1#{separator}")
  parts.join('.')
end