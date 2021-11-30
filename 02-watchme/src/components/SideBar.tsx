import { useMoviesAndGenres } from "../hooks/useMoviesAndGenres";
import { Button } from "./Button";

export function SideBar() {
  const { genres, setGenre, selectedGenreId } = useMoviesAndGenres();

  return (
    <nav className="sidebar">
      <span>Watch<p>Me</p></span>

      <div className="buttons-container">
        {genres.map(genre => (
          <Button
            key={String(genre.id)}
            title={genre.title}
            iconName={genre.name}
            onClick={() => setGenre(genre.id)}
            selected={selectedGenreId === genre.id}
          />
        ))}
      </div>
    </nav>
  );
}