require 'rubygems'
require 'bundler'
require 'yaml'

YAML::ENGINE.yamler= 'syck'
Bundler.require

require './trade_in'
run TradeIn