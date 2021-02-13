'''
GCP serverless function to return optimal bids.
'''

from flask import Flask
from pulp import *
from scipy.stats import norm
import urllib.parse
import json, re

app = Flask(__name__)

def optimize(query_params):
    prob = LpProblem("Course Bidding Problem",LpMaximize)

    # Define probability matrix, row is course, column is probability
    probabilities = []
    row = 0
    for course in query_params.get("courses"):
        probabilities.append(list())
        for i in range(query_params.get("bid_points")):        
            mean = (course["min_bid"] + course["max_bid"])/2
            range_dif = course["max_bid"] - course["min_bid"]
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
    possible_bids = range(query_params.get("bid_points"))
    possible_bid_2D = []
    for i in range(NUM_COURSES):
        possible_bid_2D.append(possible_bids)
    print("Possible bid decisions: ", len(possible_bid_2D[0]) * len(possible_bid_2D))
    # Affinity parameters
    affinities = [x['affinity'] for x in query_params.get("courses")]

    # "Happiness Function" to maximize
    tuples_list = []
    for i in range(NUM_COURSES):
        for j in range(query_params.get("bid_points")):
            tuples_list.append((i, j))
    prob += lpSum( [affinities[i] * should_bid[i][j] * probabilities[i][j] for (i, j) in tuples_list] )

    # Add constraints
    # 1. Maximum points available to bid with
    prob += lpSum( [should_bid[i][j] * possible_bid_2D[i][j] for (i, j) in tuples_list] ) <= query_params.get("bid_points")

    # 2. Required courses must be bid on
    for req_course in query_params.get("required_courses"):
        prob += lpSum( [possible_bid_2D[i][j] * should_bid[req_course][j] for (i, j) in tuples_list] ) >= 1

    # 3. Must bid on enough courses to graduate
    prob += lpSum( [should_bid[i][j] for (i, j) in tuples_list] ) >= query_params.get("courses_to_bid_on")

    # 4. Can only chose 1 optimal bid per course
    for row in should_bid:
        prob += lpSum(row) <= 1

    # Solve the linear problem
    prob.solve()
    print("Status:", LpStatus[prob.status])

    # Return result
    result = {}
    for v in prob.variables():
        if v.varValue == 1.0:
            result[v.name] = re.findall(r'\d+', v.name)[1]

    print("Value of Objective = ", value(prob.objective))

    return result

@app.route("/optimize-course-bids/<query_params>")
def get_optimal_bids(query_params):
    '''
    query_params is a uri-encoded json like:
        {
            "bid_points": 200,
            "courses_to_bid_on": 10,
            "required_courses": [0, 2, 3],
            "courses": [
                {"min_bid": 3, "max_bid": 10, "credits":0.5, "affinity":7},
                ...
            ]
        }
    '''
    query = json.loads(query_params)
    return {"api_status": "working", "query_sent": query, "result": optimize(query_params)}