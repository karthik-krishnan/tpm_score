require 'json'
require 'yaml'

def categories
  json = JSON.parse(File.read("metadata.json"))
  categories = json["sections"].inject({}){|r,j| 
    category = j["section"]
    questions = j["questions"].collect{|qs|
      if(sub_questions = qs["sub_questions"])
        sub_questions.collect{|s| "#{qs['question']} [#{s}]"}
      else  
        qs["question"]
      end
    }
    r[category] = questions.flatten
    r
  }
  categories.to_yaml
end
pp categories