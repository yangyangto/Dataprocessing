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

def parse_data(infile):
    """
    Parse in data from input file.
    """
    data = pd.read_csv(infile)
    df = pd.DataFrame(data)
    return df

def del_missings(data_frame):
    """
    Remove the entire row when it consist a missing value/ 'unknown'.
    """
    data_frame = data_frame.replace('unknown', np.nan).dropna(how='any')
    # data_frame = data_frame[data_frame.Country != 'Suriname']
    # data_frame.drop(data_frame.index[144])
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
    data_frame['Region'] = data_frame['Region'].str.rstrip(" ")

    # make data in column Population density and Infant mortality type float
    data_frame = make_float(data_frame, 'Pop. Density (per sq. mi.)')
    data_frame = make_float(data_frame, 'Infant mortality (per 1000 births)')

    # strip 'dollars' from GDP data and make it type int
    GDP = data_frame['GDP ($ per capita) dollars']
    GDP = GDP.str.strip('dollars').astype(int)

    # exclude/ mask (=make nan) outliers
    data_frame['GDP ($ per capita) dollars'] = GDP.mask(GDP > (GDP.mean() + GDP.std() * 3))
    data_frame = del_missings(data_frame)

    return data_frame

def plot_histogram(data_frame, column, xlabel):
    """
    Plot a histogram with the GDP data.
    """
    # create an histogram with the GDP data
    plt.hist(data_frame[column], bins='auto',
             color='lightseagreen', alpha=0.7, rwidth=0.85)

    # define axes, titles etc.
    plt.title(column, fontsize=12)
    plt.ylabel('Frequency')
    plt.xlabel(xlabel)
    plt.grid(True)
    plt.show()

def plot_infant_mort(data_frame, column, title):
    """
    Plot one boxplot with the Total Infant Mortality (per 1000 births)
    and one where it's grouped by Region.
    """
    # create a boxplot with total infant mortality
    data_frame.boxplot(column=[column], grid=False)
    name = 'Total '+ title
    plt.title(name)
    plt.ylabel(column)

    # create a boxplot with infant mortality per region
    data_frame.boxplot(column=[column], by='Region', grid=False, rot=75)
    name = title + ' per Region'
    plt.title(name)
    plt.ylabel(column)

    # show boxplots with the infant mortality data
    plt.show()

def central_tendency(data_frame, column):
        print('Central tendency')
        print('mean :   ', data_frame[column].mean())
        print('median : ', data_frame[column].median())
        print('mode :   ', data_frame[column].mode())
        print('stdev. : ', data_frame[column].std(), '\n')

def five_number(data_frame, column):
        print('Count, Mean, std and the Five Number Summary')
        print(data_frame[column].describe())

def create_json(data_frame):
        outfile = data_frame.to_json(orient='index')
        # print(out)
        with open('eda.json', 'w') as f:
            f.write(outfile)

if __name__ == "__main__":
    INPUT_CSV = "input.csv"
    df = parse_data(INPUT_CSV)
    df_values_only = del_missings(df)
    df_values_only = preprocess_data(df_values_only)
    central_tendency(df_values_only, 'GDP ($ per capita) dollars')
    five_number(df_values_only, 'Infant mortality (per 1000 births)')

    # plot_histogram(df_values_only, 'GDP ($ per capita) dollars', 'GDP in dollars')
    # plot_infant_mort(df_values_only, 'Infant mortality (per 1000 births)', 'Infant Mortality')

    create_json(df_values_only)

     #Suriname 144


# print(df_values_only.iloc[144][0], df_values_only.iloc[144][8])

# data_frame['GDP ($ per capita) dollars'] = data_frame['GDP ($ per capita) dollars'].str.replace('dollars', '').astype(int)

#
# def del_missings(data_frame):
#     """
#     Remove the entire row when it consist a missing value.
#     """
#     for i in range(227):
#         for j in range(20):
#             if pd.isnull(data_frame.loc[i][j]): #not iloc, want je wilt niet indexen, maar label
#                 print("yes")
#                 data_frame = data_frame.drop([i], axis=0)
#                 break
#     return data_frame

# def make_int(data_frame, old_column, column):
#     data_frame[column] = data_frame[column].apply(int)
#     data_frame[old_column] = data_frame[column]
#     return data_frame
