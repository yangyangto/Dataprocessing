#!/usr/bin/env python
# Name: Yang Yang To
# Student number:10340238
"""
This script scrapes IMDB and outputs a CSV file with highest rated movies.
"""

import csv
from requests import get
from requests.exceptions import RequestException
from contextlib import closing
from bs4 import BeautifulSoup

TARGET_URL = "https://www.imdb.com/search/title?title_type=feature" \
             "&release_date=2008-01-01,2018-01-01&num_votes=5000,&" \
             "sort=user_rating,desc"
BACKUP_HTML = 'movies.html'
OUTPUT_CSV = 'movies.csv'


def extract_movies(dom):
    """
    Extract a list of highest rated movies from DOM (of IMDB page).
    Each movie entry should contain the following fields:
    - Title
    - Rating
    - Year of release (only a number!)
    - Actors/actresses (comma separated if more than one)
    - Runtime (only a number!)
    """

    # extracting all content regarding a movie
    all_movies = dom.find_all("div",{"class" : "lister-item-content"})

    # for each movie extract the title, rating, year, actors and runtime
    # and append to the movies list
    movies =[]
    for movie in all_movies:
        # extract the title, rating and year
        title = (movie.find("a")).get_text()
        rating = (movie.find("strong")).get_text()
        year = (movie.find("span", {"class" :
                "lister-item-year text-muted unbold"})).get_text()

        # strip non digit characters from year (brackets, II etc.)
        for char in year:
            if not char.isdigit():
                year = year.strip(char)

        # extract the name of actors and append to the temporary list of actors
        actors_list =[]

        for temp in movie.find_all("p", {"class" : ""}):
            actors_data = temp.find_all("a")
            for actor in actors_data:
                # only append if actor: exclude directors
                if "_dr_" not in actor.get('href'):
                    actors_list.append(actor.get_text())

        # create a string, where actors from actors_list are joined by comma's
        actors = ", ".join(actors_list)

        # extract the movie runtime and strip 'min'
        runtime = (movie.find("span", {"class" : "runtime"})).get_text()
        runtime = runtime.strip("min, ")

        # append variables to list movies
        for variable in [title, rating, year, actors, runtime]:
            movies.append(variable)

    # return the list movies
    return movies

def save_csv(outfile, movies):
    """
    Output a CSV file containing highest rated movies.
    """
    # use writer to write in row headers in the outfile
    writer = csv.writer(outfile)
    writer.writerow(['Title', 'Rating', 'Year', 'Actors', 'Runtime'])

    # insert (5) different values for each movie into one row
    i = 0
    for _ in range(len(movies) // 5):
        writer.writerow([movies[i], movies[i+1], movies[i+2],
                        movies[i+3], movies[i+4]])
        i += 5

def simple_get(url):
    """
    Attempts to get the content at `url` by making an HTTP GET request.
    If the content-type of response is some kind of HTML/XML, return the
    text content, otherwise return None
    """
    try:
        with closing(get(url, stream=True)) as resp:
            if is_good_response(resp):
                return resp.content
            else:
                return None
    except RequestException as e:
        print('The following error occurred during HTTP GET request to {0} : {1}'
        .format(url, str(e)))
        return None


def is_good_response(resp):
    """
    Returns true if the response seems to be HTML, false otherwise
    """
    content_type = resp.headers['Content-Type'].lower()
    return (resp.status_code == 200
            and content_type is not None
            and content_type.find('html') > -1)


if __name__ == "__main__":

    # get HTML content at target URL
    html = simple_get(TARGET_URL)

    # save a copy to disk in the current directory, this serves as an backup
    # of the original HTML, will be used in grading.
    with open(BACKUP_HTML, 'wb') as f:
        f.write(html)

    # parse the HTML file into a DOM representation
    dom = BeautifulSoup(html, 'html.parser')

    # extract the movies (using the function you implemented)
    movies = extract_movies(dom)

    # write the CSV file to disk (including a header)
    with open(OUTPUT_CSV, 'w', newline='') as output_file:
        save_csv(output_file, movies)
