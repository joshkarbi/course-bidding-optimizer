
from pulp import *
import pandas as pd
from scipy.stats import norm

import json
import re

def course_with_name(name, dataframe):
    index = 0
    for row in data.values:
        if name in row[0]:
            return index
        else:
            index += 1
    return None

# Load in data and config
parameters = json.load(open("config/parameters.json", "r"))
data = pd.read_csv("data/courses.csv") 
prob = LpProblem("Course Bidding Problem",LpMaximize)

# Define probability matrix, row is course, column is probability
probabilities = []
row = 0
for course in data.values:
    probabilities.append(list())
    for i in range(parameters["Points to Bid"]):        
        mean = (course[1] + course[2])/2
        range_dif = course[2] - course[1]
        stddev = range_dif/6
        distribution = norm(mean, stddev)
        probabilities[row].append(distribution.cdf(i))
    row += 1
NUM_COURSES = len(probabilities)
print("Number of possible courses: ", len(probabilities))
print("Solving . . .")

# Define decision variables
should_bid = list() # 2D matrix of binaries binary if a course should be bid on
row_num = 0
for row in probabilities:
    should_bid.append(list())
    col_num = 0
    for col in row:
        should_bid[-1].append(LpVariable(str(row_num)+"-should-bid-"+str(col_num)+"?", cat="Binary") )
        col_num += 1
    row_num += 1

# list of possible bid values (0 -> 200 for example)
possible_bids = range(parameters["Points to Bid"])
possible_bid_2D = []
for i in range(NUM_COURSES):
    possible_bid_2D.append(possible_bids)

# Affinity parameters
affinities = data['Affinity']

# "Happiness Function" to maximize
tuples_list = []
for i in range(NUM_COURSES):
    for j in range(parameters["Points to Bid"]):
        tuples_list.append((i, j))
prob += lpSum( [affinities[i] * should_bid[i][j] * probabilities[i][j] for (i, j) in tuples_list] )

# Add constraints
# 1. Maximum points available to bid with
prob += lpSum( [should_bid[i][j] * possible_bid_2D[i][j] for (i, j) in tuples_list] ) <= parameters["Points to Bid"]

# 2. Required courses must be bid on
for req_course in parameters["Required Courses"]:
    prob += lpSum( [possible_bid_2D[i][j] * should_bid[course_with_name(req_course, data)][j] for (i, j) in tuples_list] ) >= 1

# 3. Must bid on enough courses to graduate
prob += lpSum( [should_bid[i][j] for (i, j) in tuples_list] ) >= parameters["Courses Required to Bid On"]

# 4. Can only chose 1 optimal bid per course
for row in should_bid:
    prob += lpSum(row) <= 1

# Solve the linear problem
prob.solve()
print("Status:", LpStatus[prob.status])

# Save result in output_files
with open('output_files/bidding_strategy.csv', 'w+') as out_file:   
    out_file.write("Course,Optimal Bid\n")
    for v in prob.variables():
        if v.varValue == 1.0:
            print(v.name)
            course_number = int(v.name[:v.name.find("_") ])
            numbers =  re.findall(r'\d+', v.name)
            out_file.write(str(data.values[course_number][0]) + "," + numbers[1] + "\n")

print("Value of Objective = ", value(prob.objective))