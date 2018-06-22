require 'csv'

module Api
  module V1
    module Data
      class HistoricalEmissionsCsvContent
        def initialize(filter)
          @grouped_query = filter.call
          @headers = filter.column_aliases
          @headers.shift
          @years = filter.years
        end

        def call
          CSV.generate do |csv|
            csv << @headers.map(&:humanize) + @years
            @grouped_query.each do |record|
              ary = @headers.map { |h| record[h] }
              ary += @years.map do |y|
                emission = record.emissions.find { |e| e['year'] == y }
                emission && emission['value']
              end
              csv << ary
            end
          end
        end
      end
    end
  end
end