import os
import json

path = 'formatted_test_data'
files = os.listdir(path)
questions = []
print(files)

def searchFile(curpath: str):
    fs = open(rf"{curpath}", mode="r", encoding="utf-8") #use RELATIVE paths!
    print(curpath)
    test_source = fs.readline().strip()
    num_questions = int(fs.readline().strip())
    for i in range(num_questions):
        questions.append(
            {
                "question":fs.readline().replace("\u200b", ""),
                "answer": int(fs.readline()),
                "source":test_source,
                "number": (i+1)
            }
        )
    
            
            
for item in files:
    if ".json" in item:
        continue
    searchFile(os.path.join(path, item))
fs = open("test_parser\\misc\\daily_fermi.json", mode="r", encoding="utf-8")
daily_questions = json.load(fs)
questions.extend(daily_questions)

json_object = json.dumps(questions, indent=4)
with open("formatted_test_data\\questions.json", "w") as outfile:
    outfile.write(json_object)
    
#Writing test data to data.js file which is in root directory
with open(".\\data.js", "w") as outfile:
    outfile.write("data = ")
    outfile.write(json_object)