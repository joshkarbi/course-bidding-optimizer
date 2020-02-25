
from pulp import *
import pandas as pd
from scipy.stats import norm

import json

def course_with_name(name, dataframe):
    index = 0
    for row in data.values:
        if name in row[0]:
            return index
        else:
            index += 1
    return None

# load in data and config
parameters = json.load(open("config/parameters.json", "r"))
data = pd.read_csv("data/courses.csv") 

prob = LpProblem("Course Bidding Problem",LpMaximize)

# define decision variables
bids = []
should_bid = []
for row in data.values:
    bid = LpVariable(row[0], lowBound=0, upBound=parameters["Points to Bid"], cat='Integer')
    bids.append(bid)
    should_bid.append(LpVariable(row[0]+"-should-bid?", cat="Binary"))

# define probability matrix, row is course, column is probability
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

# Affinity parameters
affinities = data['Affinity']

# # "Happiness Function" to maximize
AFFINITY = 5
MAX_BID = 3
prob += lpSum( [affinities[i] * bids[i] for i in range(NUM_COURSES)])

# Add constraints
# 1. Maximum points available to bid with
prob += lpSum(bids) <= parameters["Points to Bid"]
prob += lpSum(bids) >= 0

# 2. Required courses must be bid on
for req_course in parameters["Required Courses"]:
    prob += bids[course_with_name(req_course, data)] > 0

# 3. Must bid on enough courses to graduate
# prob += lpSum(should_bid[i] for i in range(NUM_COURSES))*0.5 == 5.0
prob += lpSum(should_bid) == 5.0

# 4. If should not bid is selected, bid for that course must be zero, else can be anything
for i in range(NUM_COURSES):
    prob += -1*should_bid[i] - bids[i] >= 0
prob.solve()

for v in prob.variables():
    print(v.name, "=", v.varValue)
