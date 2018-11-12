# Name: Yang Yang To
# Student number:10340238
import csv
import pandas as pd
import numpy as np
import matplotlib.pyplot as plt
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

def make_float(data_frame, colomn):
    """
    Make values from a colomn type float.
    """
    data_frame[colomn] = data_frame[colomn].str.replace(',', '.').astype(float)
    return data_frame

def preprocess_GDP(data_frame):
    """
    Preprocess data for analyses
    """
    data_frame['Region'] = data_frame['Region'].str.rstrip(" ")
    data_frame = make_float(data_frame, 'Pop. Density (per sq. mi.)')
    data_frame = make_float(data_frame, 'Infant mortality (per 1000 births)')

    GDP = data_frame['GDP ($ per capita) dollars']
    GDP = GDP.str.strip('dollars').astype(int)

    data_frame['GDP ($ per capita) dollars'] = GDP.mask(GDP > (GDP.mean() + GDP.std() * 3))
    data_frame = del_missings(data_frame)
    # print(data_frame)
    # data_frame['GDP ($ per capita) dollars'] = data_frame['GDP ($ per capita) dollars'].str.replace('dollars', '').astype(int)
    return data_frame

def plot_GDP(data_frame):
    """
    Plot a histogram with the GDP data.
    """
    n, bins, patches = plt.hist(data_frame['GDP ($ per capita) dollars'], bins='auto', color='lightseagreen',
                            alpha=0.7, rwidth=0.85)
    # plt.hist(data_frame['Region'], data_frame['GDP ($ per capita) dollars'])
    # plt.axis([START_YEAR, END_YEAR - 1, 0, 10])
    plt.title('GDP worldwide', fontsize=12)
    plt.ylabel('Probability')
    plt.xlabel('GDP ($ per capita) dollars')
    plt.grid(True)
    plt.show()

def plot_infant_mort(data_frame):
    """
    Plot a boxplot with the Infant Mortality (per 1000 births).
    """
    # boxplot = data_frame.boxplot(column=['Infant mortality (per 1000 births)'])
    df = pd.DataFrame(np.random.rand(10,5))
    bp = df.boxplot()


def CT(data_frame):
        print(data_frame['GDP ($ per capita) dollars'].mean())
        print(data_frame['GDP ($ per capita) dollars'].median())
        print(data_frame['GDP ($ per capita) dollars'].mode())
        print(data_frame['GDP ($ per capita) dollars'].std())
        # print(df_values_only['GDP ($ per capita) dollars'].max())

if __name__ == "__main__":
    INPUT_CSV = "input.csv"
    df = parse_data(INPUT_CSV)
    df_values_only = del_missings(df)
    df_values_only = preprocess_GDP(df_values_only)

 #Suriname 144

    # print(df_values_only.iloc[144][0], df_values_only.iloc[144][8])
    plot_GDP(df_values_only)






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

# def make_int(data_frame, old_colomn, colomn):
#     data_frame[colomn] = data_frame[colomn].apply(int)
#     data_frame[old_colomn] = data_frame[colomn]
#     return data_frame
