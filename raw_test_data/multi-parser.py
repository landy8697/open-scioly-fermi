import fileinput
import re
import os.path

filepath = "raw_test_data"
filepath2 = "test_parser"
new_filepath = "formatted_test_data"

current_file = "cmu_2023.txt" #ONLY LINE THAT NEEDS TO BE CHANGED
path = f".\\{new_filepath}\\{current_file}"
title = open(path, "r", encoding="utf-8").readline().strip() if os.path.isfile(path) else current_file #Reading old title if file is already formatted
filewrite = open(path, "w", encoding="utf-8")

settings = []
settings.extend([
    "REMOVE_POINTS", #Points are placed in parentheses
    "REMOVE_PAGE_NUMBERS", #Page numbers are removed from final questions
    "REMOVE_QUESTION_NUMBERS" # Question is marked with "Question" string, numbers need to be removed
])

q_start_pattern = r'\d+\.' #1. or 2. etc.
'''
q_start_pattern = r'\d+\.' #1. or 2. etc.
q_start_pattern = r'\d+' # 1 or 2 etc.
q_start_pattern = r'Question' #Question 1.
q_start_pattern = r'\d+\.' #1. or 2. etc.
q_start_pattern = r'\d+\)' #1) or 2) etc.
'''

answer_format =  "STYLE_QUESTION_NUMBER" # 1. Answer [WILL VARY, MOST COMMON]
'''
 "STYLE_SINGLE_NUMBER" # Answer single number one line
 "STYLE_SOLUTION:_NUMBER" # Solution: answer
 "STYLE_QUESTION_NUMBER" # 1. Answer
 "STYLE_SANDWICHED_NUMBER" #___Answer___, sandwiched between underscores
 "STYLE_EXPECTED_ANSWER" #Expected Answer: Answer
'''

question_answer_ordering = "FULL_DISJOINT" #ALL TEST SETS WILL BE READ THIS WAY
'''
"FULL_DISJOINT" #Questions, then answers (UT)
"CONTINUOUS" #Question, answer, question (BirdSO)
'''


#Importing data to remove e.g. Fermi Questions C label
question_remove = []
question_remove_file = "question_remove.txt"
for line in fileinput.input(files=(f"{filepath2}\\{question_remove_file}"), encoding="utf-8"):
    question_remove.append(line)

def setSettings(line:str):
    global q_start_pattern
    global answer_format
    if "_QUESTIONFORMAT_" in line:
        #Cutting out quotations, converting to raw string
        print(line.split(' ')[1][2:-2])
        q_start_pattern = line.split(' ')[1][2:-2]
    elif "_ANSWERFORMAT_" in line:
        answer_format = line.strip().split(' ')[1]
        print(answer_format)
    else:
        print("how did we get here?")
    
        
#Removing non question related text from questions
def questionsCleanup(question):
    for remove in question_remove:
        question.replace(remove, "")
    if "REMOVE_PAGE_NUMBERS" in settings:
        question = re.sub(r'(\s?Page \d{1,3})', '', question)
    if "REMOVE_POINTS" in settings:
        question = question.replace("(5 points)", "")
        question = question.replace("(5 pts)", "")
        question = question.replace("(5.00 pts)", "")
    if "REMOVE_QUESTION_NUMBERS" in settings:
        question = re.sub(r'\d+\.', '', question)
    return question

def isAnswer(line):
    if answer_format == "STYLE_SINGLE_NUMBER":
        return line.strip().lstrip('-+').isdigit()
    if answer_format == "STYLE_SOLUTION:_NUMBER":
        return "Solution: " in line
    if answer_format == "STYLE_QUESTION_NUMBER":
        return re.match(r'\d+\.', line)
    if answer_format == "STYLE_SANDWICHED_NUMBER": #this style searches for answers directly
        return re.search(r'_(-?\d+\.?\d*)_', line)
    if answer_format == "STYLE_EXPECTED_ANSWER":
        return "Expected Answer:" in line
    return False

def getAnswer(line):
    line = line.strip()
    if answer_format == "STYLE_SINGLE_NUMBER":
        return int(line)
    if answer_format == "STYLE_SOLUTION:_NUMBER":
        return int(line.replace("Solution: ", ""))
    if answer_format == "STYLE_QUESTION_NUMBER":
        return int(re.sub(r'\d+\.', " ", line))
    if answer_format == "STYLE_SANDWICHED_NUMBER":
        #Much more complicated regex, checks for positive and negative numbers
        return int(re.search(r'_(-?\d+\.?\d*)_', line).group()[1:-1])
    if answer_format == "STYLE_EXPECTED_ANSWER":
        return int(line.replace("Expected Answer: ", ""))
    return -9999999


def read_full_disjoint():
    question_num = 0
    for line in fileinput.input(files=(f"{filepath}\\{current_file}"), encoding="utf-8"):
        if("_QUESTIONFORMAT_" in line or "_ANSWERFORMAT_" in line):
            setSettings(line)
            continue
        if("DISCARD" in line):
            question_num += 1
            questions.append("DISCARDD") 
        if isAnswer(line):
            try: #In case the formatting for questions and answers are the same
                answers.append(getAnswer(line))
                continue
            except:
                pass
        for token in line.split():
            match = re.fullmatch(q_start_pattern, token) #question start pattern identical to 1.
            if(match): 
                if(token[:-1].isdigit() and not int(token[:-1]) == question_num+1):
                    continue #question number does not match with actual
                if(question_num > 0):
                    questions[-1] = questionsCleanup(questions[-1]).strip()
                    pass
                question_num += 1
                questions.append("") 
            elif(question_num > 0):
                questions[-1] += f" {token}"


questions = []
answers = []
total_text = ""

read_full_disjoint()
questions[-1] = questionsCleanup(questions[-1]).strip()
#print(f"QUESTION {len(questions)}: {questions[-1]}")
#print(f"ANSWER: {answers[-1]}")

print(answers)
print(f"QUESTION LENGTH: {len(questions)}, ANSWER LENGTH: {len(answers)}")
filewrite.write(title+"\n")
filewrite.write(f"{len(questions)}\n")
for i in range(len(questions)):
    filewrite.write(questions[i]+"\n")
    filewrite.write(f"{answers[i]}\n")
fileinput.close()
filewrite.close()


'''

Format Style 1:

1. (5 points) yadda yadda yadda
yadda
5
2. 




2/9 note: CHECK FOR NEWLINES, MESSED UP ISDIGIT()
'''