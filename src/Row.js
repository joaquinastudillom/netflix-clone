import React, { useState, useEffect } from 'react';
import Youtube from 'react-youtube';
import movieTrailer from 'movie-trailer';
import axios from './axios';
import './Row.css';

const BASE_URL = 'https://image.tmdb.org/t/p/original';

const Row = ({ title, fetchUrl, isLargeRow }) => {
    const [movies, setMovies] = useState([]);
    const [trailerUrl, setTrailerUrl] = useState('');

    useEffect(() => {
        const fetchData = async () => {
            const request = await axios.get(fetchUrl);
            console.log(request);
            setMovies(request.data.results);
        };
        try {
            fetchData();
        } catch (error) {
            console.log(error);
        }
    }, [fetchUrl]);

    const opts = {
        height: '390',
        width: '100%',
        playerVars: {
            autoplay: 1,
        },
    };

    const handleClick = (movie) => {
        if (trailerUrl) {
            setTrailerUrl('');
        } else {
            movieTrailer(movie.name || '')
                .then((url) => {
                    const urlParams = new URLSearchParams(new URL(url).search);
                    setTrailerUrl(urlParams.get('v'));
                })
                .catch((error) => console.log(error));
        }
    };

    return (
        <div className='row'>
            <h2>{title}</h2>
            <div className='row_posters'>
                {movies.map((movie) => (
                    <img
                        key={movie.id}
                        onClick={() => handleClick(movie)}
                        className={`row_poster ${
                            isLargeRow && 'row_posterLarge'
                        }`}
                        src={`${BASE_URL}/${
                            isLargeRow ? movie.poster_path : movie.backdrop_path
                        }`}
                        alt={movie.name}
                    />
                ))}
            </div>

            {trailerUrl && <Youtube videoId={trailerUrl} opts={opts} />}
        </div>
    );
};

export default Row;
