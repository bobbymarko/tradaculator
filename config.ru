require 'rubygems'
require 'bundler'
require 'yaml'
require './lib/no_www.rb'

YAML::ENGINE.yamler= 'syck'
Bundler.require

use NoWWW
require './trade_in'
run TradeIn