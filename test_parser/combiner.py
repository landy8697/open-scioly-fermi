import os
import json

path = 'formatted_test_data'
files = os.listdir(path)
questions = []
credit_map = {}

temp_questiononly = []
print(files)

#Reads in files from formatted_test_data
def searchFile(curpath: str):
    fs = open(rf"{curpath}", mode="r", encoding="utf-8") #use RELATIVE paths!
    print(curpath.rstrip())
    test_source = fs.readline().strip()
    num_questions = int(fs.readline().strip())
    
    for i in range(num_questions):
        
        entry = {
                "question":fs.readline().replace("\u200b", ""),
                "answer": int(fs.readline()),
                "source":test_source,
                "number": (i+1)
            }
        temp_questiononly.append(entry["question"].rstrip())
        questions.append(entry)

#Grabs every text file in formatted_test_data directory
for item in files:
    if ".json" in item:
        continue
    searchFile(os.path.join(path, item))

with open("tempquestions.txt", "w", encoding="utf-8") as outfile:
    outfile.write('\n'.join(temp_questiononly))
    
#Appends daily_fermi.json to questions
fs = open("test_parser\\misc\\daily_fermi.json", mode="r", encoding="utf-8")
daily_questions = json.load(fs)
questions.extend(daily_questions)

print(len(questions))
#Maps full source to dataset ID
for i in range(len(questions)):
    entry = questions[i]
    #`${curData.source}${curData.hasOwnProperty("number") ? ", #"+curData.number:''}`
    full_source = f"{entry['source']}{', #'+str(entry['number']) if 'number' in entry else ''}"
    if full_source in credit_map:
        print(full_source)
    credit_map[full_source.rstrip()] = i

json_object = json.dumps(questions, indent=4)
#Outputs results in questions.json
with open("formatted_test_data\\questions.json", "w") as outfile:
    outfile.write(json_object)
    

#Writing test data to data.js file which is in root directory
with open(".\\data.js", "w") as outfile:
    outfile.write("data = ")
    outfile.write(json_object)

#Writing credit map to credit_map.js file which is in root directory
with open(".\\creditMap.js", "w") as outfile:
    outfile.write("creditMap = ")
    outfile.write(json.dumps(credit_map, indent=4))
    
print(len(credit_map))
