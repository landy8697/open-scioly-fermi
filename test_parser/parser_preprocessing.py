import fileinput
import re

filepath = "C:\\Andy\\Programming Projects\\open-scioly-fermi\\raw_test_data"
filepath2 = "C:\\Andy\\Programming Projects\\open-scioly-fermi\\test_parser"
current_file = "uga_2024.txt"
new_file = "temp.txt"
#Pre Processing for tests (Ex. Cornell) That have answers on the same line as questions
'''
filewrite = open(f"{filepath}\\{new_file}", "w")
for line in fileinput.input(files=(f"{filepath}\\{current_file}"), encoding="utf-8"):
    arr = line.split()
    if(len(arr) != 0 and arr[-1].lstrip('-+').isdigit()):
        for i in range (len(arr)-1):
            filewrite.write(arr[i] + " ")
        filewrite.write("\n")
        filewrite.write(f"{arr[-1]}\n")
    else:
        filewrite.write(line)
'''
#Pre Processing for tests without question numbers pasted (Ex. Northview) 

'''
question_number = 1
cur_question = ""
for line in fileinput.input(files=(f"{filepath}\\{current_file}"), encoding="utf-8"):
    if re.match(r'-?\d+\.?\d*', line.strip()):
        print(f"{question_number}. {cur_question}")
        question_number += 1
        print(line.strip())
        cur_question = ""
    else:
        cur_question += line
'''

#Much simplier case, no numbers and one line per question

print("hello")
question_number = 1
cur_question = ""
for line in fileinput.input(files=(f"{filepath}\\{current_file}"), encoding="utf-8"):
    print(f"{question_number}. {line}")
    question_number += 1


#Remove question number and parentheses Ex: 1) 7 -> 7

'''
question_number = 1
cur_question = ""
for line in fileinput.input(files=(f"{filepath}\\{current_file}"), encoding="utf-8"):
    #remove the question number and parenthese from each line
    line = re.sub(r'\d+\)', '', line)
    print(line.strip())
'''