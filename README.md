# Course Bidding Optimizer #
A website that helps students optimize a bidding strategy for seats in university classes.

![Alt text](/frontend/static/demo.gif)

## How do I run this? ##

Frontend:

Install Node and Angular and then

```bash
cd frontend/
npm install --save-dev @angular-devkit/build-angular
ng serve --open
```

Backend:

Install python3.7+ and then

```bash
cd backend/
virtualenv bin/
source bin/bin/activat
pip install -r requirements.txt
flask run
```

## How does the optimization work? ##

The optimization is done using a linear programming model described below.

### Inputs ###

- The available bid points
- The number of classes required to graduate

Then for each course considering bidding on:
- The historical min and max bids to get into the class
- The number of credits the course is worth
- The student's affinity for the course (integer from 1 to 10)
- Whether the course is required

### Goal: Optimize (Max) Student "Happiness" ###
Student Happiness = weighted average of student's affinity for each course and the probability of getting into the course based on the chosen bid.

### Decisions ###
An amount, X(i), for each possible course, representing the amount of points to bid. 

### Constraints ###
- X(i) is an integer
- The sum of all X's is <= total bid points available to the student
- Enough courses are bid on to graduate
- Can only choose 1 optimal bid per course

### Assumptions ###
- The probability of getting into a course is the normal CDF at the chosen bid, where the mean of the distribution is the mean of the historical min and max bids for that course, and the standard deviation of bids is their difference divided by 6.
- There are no scheduling conflicts between classes.