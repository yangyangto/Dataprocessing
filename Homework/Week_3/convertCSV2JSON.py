# Name: Yang Yang To
# Student number:10340238

import csv
import pandas as pd
import numpy as np
import json
import matplotlib.pyplot as plt
"""
This script does something, CHANGE THIS!!!
"""

def parse_data(infile1, infile2):
    data = pd.read_csv(infile1)
    second_data = pd.read_csv(infile2)
    data['LNS12300002'] = second_data.LNS12300002
    data_frame = pd.DataFrame(data)

    return data_frame

def convert_json(data_frame, title):
    """
    Convert from pandas dataframe to json using 'Country' as index.
    """
    data_frame = data_frame.set_index(['DATE'])
    data_frame.to_json(title, orient='index')

if __name__ == "__main__":
    # parse data from inputfile
    INPUT_CSV_men = "Employment_men.csv"
    INPUT_CSV_women = "Employment_women.csv"
    df = parse_data(INPUT_CSV_men, INPUT_CSV_women)
    print(df)

    convert_json(df, 'employment.json')
    # convert_json(df_women, 'employment_women.json')


    # df.boxplot(column='Value', by='LOCATION', rot=90)
    # plt.show()
    # print(df)


#
# def parse_old(infile):
#     """
#     Parse in and preprocess data from input file.
#     """
#     data = pd.read_csv(infile, parse_dates=['Datetime'], infer_datetime_format=True)
#     data['Year'] = data.Datetime.dt.year
#     data['Month'] = data.Datetime.dt.month
#     data['Time'] = data.Datetime.dt.time
#     data_frame = pd.DataFrame(data)
#     data_frame['AEP_MW'] = data_frame['AEP_MW'].astype(int)
#     data_frame = data_frame.loc[(data_frame['Year'] == 2004) | (data_frame['Year'] == 2018)]
#     print(data_frame)
#     return data_frame
