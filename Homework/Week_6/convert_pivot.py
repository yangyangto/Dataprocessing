# Name: Yang Yang To
# Student number:10340238

import csv
import pandas as pd
import json

"""
Convert CSV file to JSON file.
"""

def parse_data(infile, columns):
    """
    Parse data from two infiles into a dataframe.
    """
    data = pd.read_csv(infile)
    data_frame = pd.DataFrame(data)[columns]

    return data_frame

def select_data(data_frame, column, value):
    data_frame = data_frame.loc[data_frame[column] == value]
    data_frame = data_frame.drop([column], axis=1)

    return data_frame

def convert_json(data_frame, title):
    """
    Convert from pandas dataframe to json using 'DATE' as index.
    """
    data_frame = data_frame.set_index(['Country']) #deze niet als pivot
    data_frame.to_json(title, orient='index')

if __name__ == "__main__":
    # parse data from inputfiles
    INPUT_CSV_BLI = "BLI.csv"
    df = parse_data(INPUT_CSV_BLI, ['Country', 'LOCATION', 'Indicator', 'Inequality','Value'])
    df = select_data(df, 'Inequality', "Total")
    # df1 = select_data(df, 'Indicator', 'Life satisfaction')
    df2 = df.pivot(index='LOCATION', columns='Indicator', values='Value')

    # print(df1)
    print(df2)

    df2.to_json('BLI.json', orient='index')
