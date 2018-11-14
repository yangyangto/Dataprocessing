# Name: Yang Yang To
# Student number:10340238
import csv
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
import json
"""
This script does something, EDA
"""

def parse_data(infile, columns):
    """
    Parse in (specific) data from input file.
    """
    data = pd.read_csv(infile)
    data_frame = pd.DataFrame(data)[columns]

    return data_frame

def del_missings(data_frame):
    """
    Remove the entire row when it consist a missing value/ 'unknown'.
    """
    data_frame = data_frame.replace('unknown', np.nan).dropna(how='any')

    return data_frame

def make_float(data_frame, column):
    """
    Make values from a column type float.
    """
    data_frame[column] = data_frame[column].str.replace(',', '.').astype(float)
    return data_frame

def preprocess_data(data_frame):
    """
    Preprocess data for analyses
    """
    # strip spaces on the right of all data in column Region
    data_frame['Region'] = data_frame['Region'].str.rstrip()

    # make data in column Population density and Infant mortality type float
    data_frame = make_float(data_frame, 'Pop. Density (per sq. mi.)')
    data_frame = make_float(data_frame, 'Infant mortality (per 1000 births)')

    # strip 'dollars' from GDP data and make it type int
    GDP = data_frame['GDP ($ per capita) dollars']
    data_frame['GDP ($ per capita) dollars'] = GDP.str.strip('dollars').astype(int)

    return data_frame

def exclude_outliers(data_frame, column):
    """
    Exclude the entire row if there's an outlier.
    """
    df_column = data_frame[column]
    data_frame[column] = df_column.mask(df_column > (df_column.mean() +
                                        df_column.std() * 3))
    data_frame = del_missings(data_frame)

    return data_frame

def plot_histogram(data_frame, column, xlabel):
    """
    Plot a histogram using data from a specific column.
    """
    # create an histogram with the GDP data
    plt.hist(data_frame[column], bins='auto',
             alpha=0.7, rwidth=0.85)

    # define axes, titles etc.
    plt.title(column, fontsize=12)
    plt.ylabel('Frequency')
    plt.xlabel(xlabel)
    plt.grid(True)

    plt.show()

def plot_boxplot(data_frame, column, title):
    """
    Plot two boxplots, one using the all data altogether, one where it's
    grouped by Region.
    """
    # create a boxplot with total infant mortality
    data_frame.boxplot(column=[column], grid=False)
    name = 'Total '+ title
    plt.title(name)
    plt.ylabel(column)

    # create a boxplot with infant mortality per region
    data_frame.boxplot(column=[column], by='Region', grid=False, rot=78)
    name = title + ' per Region'
    plt.title(name)
    plt.ylabel(column)
    plt.tight_layout()

    # remove the default (grouped by) title
    plt.suptitle('')

    plt.show()

def central_tendency(data_frame, column):
    """
    Print common measures of the Central Tendency.
    """
    print('Central tendency of', column)
    print('mean :   ', data_frame[column].mean())
    print('median : ', data_frame[column].median())
    print('mode :   ', data_frame[column].mode()[0])
    print('stdev. : ', data_frame[column].std(), '\n')

def five_number(data_frame, column):
    """
    Print the Count, Mean, std and the Five Number Summery.
    """
    print('Count, Mean, std and the Five Number Summary of', column)
    print(data_frame[column].describe())

def convert_json(data_frame):
    """
    Convert from pandas dataframe to json using 'Country' as index.
    """
    data_frame = data_frame.set_index(['Country'])
    data_frame.to_json('eda.json', orient='index')

if __name__ == "__main__":
    # parse data from inputfile
    INPUT_CSV = "input.csv"
    df = parse_data(INPUT_CSV, ['Country', 'Region', 'Pop. Density (per sq. mi.)',
                    'Infant mortality (per 1000 births)',
                    'GDP ($ per capita) dollars'])

    # clean and preprocess data
    df_values_only = del_missings(df)
    df_values_only = preprocess_data(df_values_only)

    # plot two histograms using GDP data, one with and one without outliers
    plt.style.use('seaborn-dark')
    plot_histogram(df_values_only, 'GDP ($ per capita) dollars', 'GDP in dollars')
    df_values_only = exclude_outliers(df_values_only, 'GDP ($ per capita) dollars')
    plot_histogram(df_values_only, 'GDP ($ per capita) dollars', 'GDP in dollars')

    # plot a boxplot using Infant mortality data
    plot_boxplot(df_values_only, 'Infant mortality (per 1000 births)',
                 'Infant Mortality')

    # print central_tendency of GDP data and five number summary of infant mort.
    central_tendency(df_values_only, 'GDP ($ per capita) dollars')
    five_number(df_values_only, 'Infant mortality (per 1000 births)')

    # convert pandas dataframe to json file
    convert_json(df_values_only)
