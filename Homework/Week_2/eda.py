# Name: Yang Yang To
# Student number:10340238
import csv
import pandas as pd
import numpy as np
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
    return data_frame

def make_int(data_frame, old_colomn, colomn):
    data_frame[colomn] = data_frame[colomn].apply(int)
    data_frame[old_colomn] = data_frame[colomn]
    return data_frame

def make_float(data_frame, colomn):
    # data_frame[colomn] = data_frame[colomn].str.replace(',', '.').astype(float)
    data_frame['Pop. Density (per sq. mi.)'] = data_frame['Pop. Density (per sq. mi.)'].str.replace(',', '.').astype(float)
    return data_frame

def preprocess_GDP(data_frame):
    # remove 'dollars' from values in GDP colomn
    # data_frame['GDP_colomn'] = data_frame['GDP ($ per capita) dollars'].str.strip('dollars')
    # make_int(data_frame, 'GDP ($ per capita) dollars','GDP_colomn')
    #
    # return data_frame

    data_frame['GDP ($ per capita) dollars'] = data_frame['GDP ($ per capita) dollars'].str.replace('dollars', '').astype(int)
    return data_frame

if __name__ == "__main__":
    INPUT_CSV = "input.csv"
    df = parse_data(INPUT_CSV)
    df_values_only = del_missings(df)

    df_values_only = preprocess_GDP(df_values_only)
    df_values_only = make_float(df_values_only, 'Pop. Density (per sq. mi.)')
    df_values_only = make_float(df_values_only, 'Infant mortality (per 1000 births)')
    # df_values_preprocessed = make_int(df_values_only, "Population", 'Population')
    print(df_values_only['Pop. Density (per sq. mi.)'])
    print(df_values_only.iloc[1][2] * 2)



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
