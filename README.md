# Course-Bidding-Optimization
A linear programming model to optimize a bidding strategy for seats in classes.

# Dependencies
- PuLP linear programming library for Python

# Running
- Set `data/courses.csv` to contain data on courses considering bidding on
- Set `config/parameters.json` according to bidding parameters
- Run with `python3 optimize.py`

# Model
## Optimize (Max)
"Happiness Function" --> EV of student happiness based on affinity of courses, bid chosen, and probability of getting into a course based on the bid chosen

## Decisions
An amount, X(i), for each possible course, representing the amount of points to bid. 

## Constraints
- X(i) is an integer
- The sum of all X's is <= total bid points alloded
- Enough courses are bid on to graduate (see `config/parameters.json`)
- Can only choose 1 optimal bid per course

## Output
Outputs `output_files/bidding_strategy.csv` containing optimal bidding strategy

## Assumptions
- Bids exist on a normal distribution, and the probability of getting into a course is equal to the area under the normal curve between (HISTORICAL_MIN_BID, HISTORICAL_MAX_BID)
- Any courses given to the model in `data/courses.csv` do not contain scheduling conflicts