#!/usr/bin/env python
# Name: Yang Yang To
# Student number: 10340238
"""
This script visualizes data obtained from a .csv file
"""

import csv
import matplotlib.pyplot as plt
from matplotlib.ticker import FormatStrFormatter

# Global constants for the input file, first and last year
START_YEAR = 2008
END_YEAR = 2018
average_list = []
year_list = []

def parse_ratingdata(infile):
    """
    Parse data regarding the rating of movies
    """
    # global dictionary for the data
    data_dict = {str(key): [] for key in range(START_YEAR, END_YEAR)}

    # open movies.csv and append the rating of a movie to the list of the according year
    with open(INPUT_CSV) as csvfile:
        reader = csv.DictReader(csvfile)
        for row in reader:
            data_dict[row['Year']].append(float(row['Rating']))

    # create a list with the average rating of the movies per year
    for year in data_dict:
        average_movie = average(data_dict[year])
        average_list.append(average_movie)
        year_list.append(int(year))

    # return the average_list and year_list
    return(average_list, year_list)

def average(lst):
    """
    Calculate the average_list
    """
    return sum(lst) / len(lst)

def plot_rating(x_list, y_list):
    # create a line chart with the average rating of the movies per year
    fig, ax = plt.subplots()
    plt.plot(x_list, y_list, color = 'lightseagreen')
    plt.title('Average Movie Rating per Year\n', fontsize=16)
    plt.ylabel('Average Rating')
    plt.xlabel('Year')

    # define axes, including one ratings with one decimal on y-axis
    # and all years on the x-axis
    plt.axis([START_YEAR, END_YEAR - 1, 0, 10])
    ax.yaxis.set_major_formatter(FormatStrFormatter('%.1f'))
    plt.xticks(x_list)

    # define layout of the chart
    plt.grid(True)
    ax.spines['bottom'].set_color('grey')
    ax.spines['top'].set_color('#dddddd')
    ax.spines['right'].set_color('#dddddd')
    ax.spines['left'].set_color('grey')

    plt.show()

if __name__ == "__main__":
    # initialize the input file
    INPUT_CSV = "movies.csv"

    # parsing data from input file
    parse_ratingdata(INPUT_CSV)

    # plot rating chart
    plot_rating(year_list, average_list)
