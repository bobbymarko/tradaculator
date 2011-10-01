require 'test_helper'

class TradeInValuesControllerTest < ActionController::TestCase
  setup do
    @trade_in_value = trade_in_values(:one)
  end

  test "should get index" do
    get :index
    assert_response :success
    assert_not_nil assigns(:trade_in_values)
  end

  test "should get new" do
    get :new
    assert_response :success
  end

  test "should create trade_in_value" do
    assert_difference('TradeInValue.count') do
      post :create, trade_in_value: @trade_in_value.attributes
    end

    assert_redirected_to trade_in_value_path(assigns(:trade_in_value))
  end

  test "should show trade_in_value" do
    get :show, id: @trade_in_value.to_param
    assert_response :success
  end

  test "should get edit" do
    get :edit, id: @trade_in_value.to_param
    assert_response :success
  end

  test "should update trade_in_value" do
    put :update, id: @trade_in_value.to_param, trade_in_value: @trade_in_value.attributes
    assert_redirected_to trade_in_value_path(assigns(:trade_in_value))
  end

  test "should destroy trade_in_value" do
    assert_difference('TradeInValue.count', -1) do
      delete :destroy, id: @trade_in_value.to_param
    end

    assert_redirected_to trade_in_values_path
  end
end
