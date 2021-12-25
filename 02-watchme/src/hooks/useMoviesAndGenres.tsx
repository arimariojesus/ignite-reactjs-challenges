/**
 * Hook By: Arimário Jesus - https://github.com/arimariojesus
 */


import { createContext, ReactNode, useCallback, useContext, useEffect, useState } from 'react';
import { api } from '../services/api';

interface GenreResponseProps {
  id: number;
  name: 'action' | 'comedy' | 'documentary' | 'drama' | 'horror' | 'family';
  title: string;
}

interface MovieProps {
  imdbID: string;
  Title: string;
  Poster: string;
  Ratings: Array<{
    Source: string;
    Value: string;
  }>;
  Runtime: string;
}

interface MoviesAndGenresProps {
  movies: MovieProps[];
  genres: GenreResponseProps[];
  selectedGenre: GenreResponseProps;
  selectedGenreId: number;
  setGenre: (id: number) => void;
}

const MoviesAndGenresContext = createContext({} as MoviesAndGenresProps);

export const MoviesAndGenresProvider = ({ children }: { children?: ReactNode }) => {
  const [selectedGenreId, setSelectedGenreId] = useState(1);
  const [selectedGenre, setSelectedGenre] = useState<GenreResponseProps>({} as GenreResponseProps);

  const [genres, setGenres] = useState<GenreResponseProps[]>([]);
  const [movies, setMovies] = useState<MovieProps[]>([]);

  const fetchGenres = useCallback(() => {
    api.get<GenreResponseProps[]>('genres').then(response => {
      setGenres(response.data);
    });
  }, []);

  const fetchMoviesByGenre = useCallback(async () => {
    const { data } = await api.get<MovieProps[]>(`movies/?Genre_id=${selectedGenreId}`);
    return data;
  }, [selectedGenreId]);

  const fetchGenre = useCallback(async () => {
    const { data } = await api.get<GenreResponseProps>(`genres/${selectedGenreId}`);
    return data;
  }, [selectedGenreId]);

  useEffect(() => {
    fetchGenres();
  }, []);

  useEffect(() => {
    (async () => {
      const newMovies = await fetchMoviesByGenre();
      setMovies(newMovies);

      const newGenre = await fetchGenre();
      setSelectedGenre(newGenre);
    })();
  }, [selectedGenreId]);

  const setGenre = (id: number) => {
    setSelectedGenreId(id);
  };

  return (
    <MoviesAndGenresContext.Provider value={{
      genres,
      movies,
      selectedGenre,
      selectedGenreId,
      setGenre,
    }}>
      {children}
    </MoviesAndGenresContext.Provider>
  );
};

export const useMoviesAndGenres = () => useContext(MoviesAndGenresContext);
