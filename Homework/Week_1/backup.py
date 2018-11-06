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
INPUT_CSV = "movies.csv"
START_YEAR = 2008
END_YEAR = 2018

# global dictionary for the data
data_dict = {str(key): [] for key in range(START_YEAR, END_YEAR)}

# open movies.csv and append the rating of a movie to the list of the according year
with open(INPUT_CSV) as csvfile:
    reader = csv.DictReader(csvfile)
    for row in reader:
        data_dict[row['Year']].append(float(row['Rating']))

# calculate the average
def Average(lst):
    return sum(lst) / len(lst)

# create a list with the average rating of the movies per year
average_list = []
year_list = []
for year in data_dict:
    average_movie = Average(data_dict[year])
    average_list.append(average_movie)
    year_list.append(int(year))
#     average_list[year] = average_movie
# print(average_list)

# create a line chart with the average rating of the movies per year
fig, ax = plt.subplots()
plt.plot(year_list, average_list, color = 'lightseagreen')
plt.title('Average Movie Rating per Year\n', fontsize=16)
plt.ylabel('Average Rating')
plt.xlabel('Year')
plt.grid(True)
plt.axis([START_YEAR, END_YEAR, 0.0, 10.0])
ax.yaxis.set_major_formatter(FormatStrFormatter('%.2f'))


if __name__ == "__main__":
    print(data_dict)
    plt.show()
