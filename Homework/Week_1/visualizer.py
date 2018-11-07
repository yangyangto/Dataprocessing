#!/usr/bin/env python
# Name: Yang Yang To
# Student number: 10340238
"""
This script visualizes data obtained from a .csv file
"""

import csv
import matplotlib.pyplot as plt

# initialize first and last year globally
START_YEAR = 2008
END_YEAR = 2018

# create a list of years within the range(2008-2017)
year_list =[]
for year in range(START_YEAR, END_YEAR):
    year_list.append(year)

def parse_data(infile, variable, average_list):
    """
    Parse data regarding the (IMDB) rating of movies
    """
    # dictionary for the data
    data_dict = {str(key): [] for key in range(START_YEAR, END_YEAR)}

    # open inputfile and append the values of the variable to the list of
    # a certain year in the dictionary
    with open(infile) as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            data_dict[row['Year']].append(float(row[variable]))

    # append the average of the variable per year to another list
    for year in data_dict:
        average_list.append(average(data_dict[year]))

    # return the list with averages
    return average_list

def average(lst):
    """
    Calculate the average_list
    """
    return sum(lst) / len(lst)

def plot_subplots(x_list, y_list, z_list):
    """
    Plot the average (IMDB) rating and runtime per year of the top 50 movies
    """
    # create a line chart with the average rating of the top movies per year
    # min rating = 0 and max = 10
    plot1 = plt.subplot(211)
    plt.plot(x_list, y_list, color = 'lightseagreen')
    plt.axis([START_YEAR, END_YEAR - 1, 0, 10])
    plt.title('Average IMDB Movie Rating per Year', fontsize=12)
    plt.ylabel('Average Rating')
    plt.grid(True)

    # make x ticklabels of plot1 invisible
    plt.setp(plot1.get_xticklabels(), visible=False)

    # adjust space between subplots
    plt.subplots_adjust(hspace=0.3)

    # create a line chart with the average runtime with shared x-axis
    plot2 = plt.subplot(212, sharex=plot1)
    plt.plot(x_list, z_list, color = 'lightseagreen')
    plt.title('Average IMDB Movie Runtime per Year', fontsize=12)
    plt.ylabel('Average Runtime (min)')
    plt.grid(True)

    # define axes, with all years (2008 till 2017) on the x-axis
    # min runtime = 0, max runtime = 180
    plt.axis([START_YEAR, END_YEAR - 1, 0, 180])
    plt.xticks(x_list)
    plt.xlabel('Year')

    # plot both the subplots
    plt.show()

if __name__ == "__main__":
    # initialize the input file
    INPUT_CSV = "movies.csv"

    # initialize the lists with averages
    average_rating = []
    average_runtime = []

    # parsing data from input file into the lists
    parse_data(INPUT_CSV, 'Rating', average_rating)
    parse_data(INPUT_CSV, 'Runtime', average_runtime)

    # plot rating and runtime chart
    plot_subplots(year_list, average_rating, average_runtime)
