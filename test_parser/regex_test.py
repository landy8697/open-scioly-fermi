import re

'''

match = re.match(r'Question \d+\.', "Question 24. Question 25. What is the probability of winning an expert-difficulty game of minesweepe")
print(match.groups())

print(re.fullmatch(r'Question \d+\.',"Question 21.").group(


'''

res = re.search(r'_(-?\d+\.?\d*)_', '2. ___-12___')
print(int(res.group()[1:-1]))


