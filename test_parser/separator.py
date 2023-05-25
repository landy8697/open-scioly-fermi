

import sys
a = []
for line in sys.stdin:
    if len(line.strip()) == 0:
        break
    a.append(line)
for line in a:
    print(line.split(' ')[1])
 
print("Exit")