#Corrections will be updated every week

import csv
import json
'''
Timestamp,
Full problem attribution (Copy the full italicized problem crediting),
Revised Question Text (Optional),
"Revised Fermi Answer, (Optional) ->  Must be an integer",
"Explanation (If changing answer, provide a brief explanation for how the new answer was reached, nothing insanely long or fancy needed)",
"Credits (Optional, but we want to thank whoever fixed the problem :D, preferred discord or forums name)"
'''
#Removing the heading
file_object = open('corrections\\responses.csv', 'r')
heading = next(file_object)
csv_reader = csv.reader(file_object, delimiter=',')
corrections = {}
for row in csv_reader:
    corrections[row[1].rstrip()] = {
        "question":row[2].rstrip(),
        "answer":row[3],
        "explanation":row[4].rstrip(),
        "credit":row[5].rstrip()
    }

json_object = json.dumps(corrections, indent=4)
with open(".\\corrections.js", "w") as outfile:
    outfile.write("corrections = ")
    outfile.write(json_object)