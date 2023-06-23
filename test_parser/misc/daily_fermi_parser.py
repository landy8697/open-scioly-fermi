import re
import json

path = "test_parser\\misc"
filename = "daily_fermi_raw_data.txt"
fs = open(f"{path}\\{filename}", mode="r", encoding="utf-8")

num = 675
attr = []
questions = []
answers = []

for i in range(num):
    attr.append(fs.readline().rstrip())
print("daily fermi questions" in "daily fermi questions #114 answers")

lines = fs.readlines()
cnt = 0
found = 0
day = 135 + 1
for line in lines:
    if found > 0:
        #print(line)
        answers.append(int(line.rstrip())) if cnt%2 == 1 else questions.append(line.rstrip())
        found-=1
    elif bool(re.search(r"daily.*?#(\d+)", line)):
        #print(re.search(r"daily.*?#(\d+)", line).group())
        found = 5
        cnt += 1
        day -= 1

dataset = []
for i in range(675):
    dataset.append(
        
        {
            "question":questions[675-i-1],
            "answer": answers[675-i-1],
            "source": f"RobertYL, daily fermi questions day #{i//5+1} [{attr[i]}]"
        }
        
    )

json_object = json.dumps(dataset, indent=4)
with open("test_parser\\misc\\daily_fermi.json", "w") as outfile:
    outfile.write(json_object)
    
            