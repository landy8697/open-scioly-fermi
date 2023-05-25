import fileinput
import re

filepath = "C:\\Andy\\Programming Projects\\discord-fermi-bot\\raw_test_data"
filepath2 = "C:\\Andy\\Programming Projects\\discord-fermi-bot\\test_parser"
new_filepath = "C:\\Andy\\Programming Projects\\discord-fermi-bot\\formatted_test_data"

current_file = "milpitas_2022.txt"
filewrite = open(f"{new_filepath}\\{current_file}", "w", encoding="utf-8")

settings = []
settings.extend([
    "REMOVE_POINTS", #Points are placed in parentheses
    "REMOVE_PAGE_NUMBERS", #Page numbers are removed from final questions
    "REMOVE_QUESTION_NUMBERS" # Question is makred with "Question" string, numbers need to be removed
])
answer_format =  "STYLE_QUESTION_NUMBER" # 1. Answer
'''
 "STYLE_SINGLE_NUMBER" # Answer single number one line
 "STYLE_SOLUTION:_NUMBER" # Solution: answer
 "STYLE_QUESTION_NUMBER" # 1. Answer
 "STYLE_SANDWICHED_NUMBER" #___Answer___, sandwiched between underscores
 "STYLE_EXPECTED_ANSWER" #Expected Answer: Answer
'''
question_answer_ordering = "FULL_DISJOINT" #Questions, then answers (UT)
'''
"FULL_DISJOINT" #Questions, then answers (UT)
"CONTINUOUS" #Question, answer, question (BirdSO)
'''
q_start_pattern = r'\d+\.' #1. or 2. etc.
'''
q_start_pattern = r'\d+\.' #1. or 2. etc.
q_start_pattern = r'\d+' # 1 or 2 etc.
q_start_pattern = r'Question' #Question 1.
q_start_pattern = r'\d+\.' #1. or 2. etc.
q_start_pattern = r'\d+\)' #1) or 2) etc.
'''



#Importing data to remove e.g. Fermi Questions C label
question_remove = []
question_remove_file = "question_remove.txt"
for line in fileinput.input(files=(f"{filepath2}\\{question_remove_file}"), encoding="utf-8"):
    question_remove.append(line)

#Removing non question related text from questions
def questionsCleanup(question):
    #print(question)
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
    #print(question)
    return question

def isAnswer(line):
    #print(f"{line}{line.isdigit()}")
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


questions = []
answers = []
total_text = ""
def read_continuous():
    question_num = 0
    next_answer = 0
    for line in fileinput.input(files=(f"{filepath}\\{current_file}"), encoding="utf-8"):
        if("DISCARD" in line):
            question_num += 1
            questions[-1] = "DISCARDED"
            questions.append("") 
            answers.append(next_answer)
        if isAnswer(line):
            next_answer = getAnswer(line)
            continue
        for token in line.split():
            match = re.fullmatch(q_start_pattern, token)
            if(match): #question start pattern identical to 1.
                if(token[:-1].isdigit() and not int(token[:-1]) == question_num+1):
                    continue
                if(question_num > 0):
                    questions[-1] = questionsCleanup(questions[-1]).strip()
                    answers.append(next_answer)
                #    print(f"QUESTION {question_num}: {questions[-1]}")
                #    print(f"ANSWER: {answers[-1]}")
                    pass
                question_num += 1
                questions.append("") 
            elif(question_num > 0):
                questions[-1] += f" {token}"
    answers.append(next_answer)

def read_full_disjoint():
    question_num = 0
    for line in fileinput.input(files=(f"{filepath}\\{current_file}"), encoding="utf-8"):
        if("DISCARD" in line):
            question_num += 1
            #questions[-1] = "DISCARDED"
            #answers.append(0)
            questions.append("DISCARDD") 
        if isAnswer(line):
            try: #In case the formatting for questions and answers are the same
                answers.append(getAnswer(line))
                continue
            except:
                pass
        for token in line.split():
            match = re.fullmatch(q_start_pattern, token)
            if(match): #question start pattern identical to 1.
                if(token[:-1].isdigit() and not int(token[:-1]) == question_num+1):
                    continue #question number does not match with actual
                if(question_num > 0):
                    questions[-1] = questionsCleanup(questions[-1]).strip()
                    pass
                question_num += 1
                questions.append("") 
            elif(question_num > 0):
                questions[-1] += f" {token}"

if(question_answer_ordering == "CONTINUOUS"):
    read_continuous()
elif(question_answer_ordering == "FULL_DISJOINT"):
    read_full_disjoint()
questions[-1] = questionsCleanup(questions[-1]).strip()
#print(f"QUESTION {len(questions)}: {questions[-1]}")
#print(f"ANSWER: {answers[-1]}")

print(answers)
print(f"QUESTION LENGTH: {len(questions)}, ANSWER LENGTH: {len(answers)}")
filewrite.write(current_file+"\n")
filewrite.write(f"{len(questions)}\n")
for i in range(len(questions)):
    #print(questions[i])
    #print(answers[i])
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