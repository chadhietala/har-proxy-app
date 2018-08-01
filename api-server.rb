require 'sinatra'
require 'json'
require 'time'

get '/api/profile.json' do
  content_type :json
  { :data => "Hello #{Time.new()}" }.to_json
end