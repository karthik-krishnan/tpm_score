require 'csv'
require 'yaml'
csv = CSV.parse(File.read("test.csv"), headers: true)
metadata = YAML.load(File.read("tpm_metadata.yml"))
categories = YAML.load(File.read("categories.yml"))

results = metadata.keys.inject({}){|r, x|
  #puts x
  r[x] = metadata[x].index(csv[x].first)+1 rescue 0
  r
}
require 'pp'
#pp results
scores = categories.keys.each.inject({}){|r, x|
  headers = categories[x]
  r[x] = headers.collect{|h| results[h]}.sum.to_f/headers.size.to_f
  r 
}
pp scores