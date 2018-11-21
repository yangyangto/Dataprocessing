# Name: Yang Yang To
# Student number:10340238

import csv
import pandas as pd
import json

"""
Convert CSV file to JSON file.
"""

def parse_data(infile1, infile2):
    """
    Parse data from two infiles into a dataframe.
    """
    data = pd.read_csv(infile1)
    second_data = pd.read_csv(infile2)
    data['LNS12300002'] = second_data.LNS12300002
    data_frame = pd.DataFrame(data)

    return data_frame

def convert_json(data_frame, title):
    """
    Convert from pandas dataframe to json using 'DATE' as index.
    """
    data_frame = data_frame.set_index(['DATE'])
    data_frame.to_json(title, orient='index')

if __name__ == "__main__":
    # parse data from inputfiles
    INPUT_CSV_men = "Employment_men.csv"
    INPUT_CSV_women = "Employment_women.csv"
    df = parse_data(INPUT_CSV_men, INPUT_CSV_women)

    # convert into json format
    convert_json(df, 'employment.json')
