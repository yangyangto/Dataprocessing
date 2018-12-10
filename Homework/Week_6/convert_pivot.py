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

    data_frame = data_frame.loc[data_frame['Inequality'] == 'Total']
    data_frame = data_frame.drop(['Inequality'], axis=1)

    return data_frame

def convert_json(data_frame, title):
    """
    Convert from pandas dataframe to json using 'DATE' as index.
    """
    data_frame.to_json(title, orient='index')

if __name__ == "__main__":
    # parse data from inputfiles
    INPUT_CSV_BLI = "BLI.csv"
    df = parse_data(INPUT_CSV_BLI, ['Country', 'Indicator', 'Inequality','Value'])

    df = df.pivot(index='Country', columns='Indicator', values='Value')

    print(df)

    convert_json(df, 'BLI2.json')
