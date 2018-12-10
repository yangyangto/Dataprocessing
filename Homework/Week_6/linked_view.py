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

def group_data(df, indicator):
    df = df.loc[df['Indicator'] == indicator]
    df = df.loc[df['Inequality'] == 'Total']
    df[indicator] = df.pop('Value')

    df = df.drop(['LOCATION', 'Indicator', 'Inequality'], axis=1)
    return df


def convert_json(data_frame, title):
    """
    Convert from pandas dataframe to json using 'DATE' as index.
    """
    data_frame = data_frame.set_index(['Country'])
    data_frame.to_json(title, orient='index')

if __name__ == "__main__":
    # parse data from inputfiles
    INPUT_CSV_BLI = "BLI.csv"
    df = parse_data(INPUT_CSV_BLI, ['LOCATION', 'Country', 'Indicator', 'Inequality','Value'])

    df1 = group_data(df, 'Employees working very long hours')
    df2 = group_data(df, 'Time devoted to leisure and personal care')
    df4 = group_data(df, 'Life satisfaction')
    # df4 = df4.drop(['LOCATION', 'Indicator', 'Inequality'], axis=1)
    df3 = df1.join(df2.set_index('Country'), on='Country')
    df5 = df3.join(df4.set_index('Country'), on='Country')
    # df5 = df5.drop(['Indicator'], axis=1)

    convert_json(df5, 'linked_view_BLI.json')
