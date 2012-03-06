# encoding: UTF-8
# This file is auto-generated from the current state of the database. Instead
# of editing this file, please use the migrations feature of Active Record to
# incrementally modify your database, and then regenerate this schema definition.
#
# Note that this schema.rb definition is the authoritative source for your
# database schema. If you need to create the application database on another
# system, you should be using db:schema:load, not running all the migrations
# from scratch. The latter is a flawed and unsustainable approach (the more migrations
# you'll amass, the slower it'll run and the greater likelihood for issues).
#
# It's strongly recommended to check this file into your version control system.

ActiveRecord::Schema.define(:version => 20120103040352) do

  create_table "games", :force => true do |t|
    t.string   "title"
    t.string   "upc"
    t.string   "platform"
    t.string   "image"
    t.string   "large_image"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "small_image"
    t.string   "amazon_id"
    t.string   "best_buy_id"
    t.string   "glyde_id"
  end

  add_index "games", ["upc"], :name => "index_games_on_upc"

  create_table "library_items", :force => true do |t|
    t.integer  "user_id"
    t.integer  "game_id"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "trade_in_values", :force => true do |t|
    t.datetime "created_at"
    t.datetime "updated_at"
  end

  create_table "users", :force => true do |t|
    t.string   "email",                                   :default => "", :null => false
    t.string   "encrypted_password",       :limit => 128, :default => "", :null => false
    t.string   "reset_password_token"
    t.datetime "reset_password_sent_at"
    t.datetime "remember_created_at"
    t.integer  "sign_in_count",                           :default => 0
    t.datetime "current_sign_in_at"
    t.datetime "last_sign_in_at"
    t.string   "current_sign_in_ip"
    t.string   "last_sign_in_ip"
    t.datetime "created_at"
    t.datetime "updated_at"
    t.string   "username"
    t.string   "xbox_live_name"
    t.string   "playstation_network_name"
  end

  add_index "users", ["email"], :name => "index_users_on_email", :unique => true
  add_index "users", ["reset_password_token"], :name => "index_users_on_reset_password_token", :unique => true

  create_table "values", :force => true do |t|
    t.integer  "game_id",    :null => false
    t.string   "vendor",     :null => false
    t.integer  "value"
    t.datetime "created_at"
    t.datetime "updated_at"
  end

end
