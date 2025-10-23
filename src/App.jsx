import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useParams } from "react-router-dom";

const MovieCard = ({ movie }) => {
  return (
    <Link to={`/movie/${movie.title}`} className="block">
      <div className="w-64 bg-white shadow-md rounded-2xl overflow-hidden hover:shadow-lg transition-shadow">
        <img
          src={movie.posterURL}
          alt={movie.title}
          className="w-full h-80 object-cover"
        />
        <div className="p-4">
          <h2 className="text-lg font-semibold">{movie.title}</h2>
          <p className="text-sm text-gray-500 line-clamp-2">{movie.description}</p>
          <div className="flex items-center mt-2">
            {[...Array(5)].map((_, i) => (
              <span key={i}>{i < movie.rating ? "⭐" : "☆"}</span>
            ))}
          </div>
        </div>
      </div>
    </Link>
  );
};

const MovieList = ({ movies }) => (
  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6 mt-6">
    {movies.map((movie, index) => (
      <MovieCard key={index} movie={movie} />
    ))}
  </div>
);

const Filter = ({ titleFilter, setTitleFilter, rateFilter, setRateFilter }) => (
  <div className="flex gap-4 mt-6">
    <input
      type="text"
      placeholder="Filter by title..."
      value={titleFilter}
      onChange={(e) => setTitleFilter(e.target.value)}
      className="w-1/2 border p-2 rounded-lg"
    />
    <input
      type="number"
      min="0"
      max="5"
      placeholder="Min rating"
      value={rateFilter}
      onChange={(e) => setRateFilter(Number(e.target.value))}
      className="w-1/4 border p-2 rounded-lg"
    />
  </div>
);

const MovieDetails = ({ movies }) => {
  const { title } = useParams();
  const movie = movies.find((m) => m.title === title);

  if (!movie) return <p className="text-center mt-8">Movie not found.</p>;

  return (
    <div className="p-8 max-w-3xl mx-auto">
      <Link to="/" className="text-blue-600 hover:underline mb-4 inline-block">
        ← Back to Home
      </Link>

      <div className="bg-white shadow-md rounded-2xl overflow-hidden">
        <img
          src={movie.posterURL}
          alt={movie.title}
          className="w-full h-96 object-cover"
        />
        <div className="p-6">
          <h1 className="text-3xl font-bold mb-2">{movie.title}</h1>
          <p className="text-gray-600 mb-4">{movie.description}</p>

          {movie.trailerURL && (
            <div className="aspect-w-16 aspect-h-9">
              <iframe
                src={movie.trailerURL}
                title={movie.title}
                allowFullScreen
                className="w-full h-96 rounded-lg"
              ></iframe>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

const App = () => {
  const [movies, setMovies] = useState([
    {
      title: "Inception",
      description: "A skilled thief leads a dream heist within the subconscious.",
      posterURL:
        "https://m.media-amazon.com/images/I/81p+xe8cbnL._AC_SY679_.jpg",
      rating: 5,
      trailerURL: "https://www.youtube.com/embed/8hP9D6kZseM",
    },
    {
      title: "Interstellar",
      description: "A team travels through a wormhole in search of a new home for humanity.",
      posterURL:
        "https://m.media-amazon.com/images/I/81By2VQs5gL._UF894,1000_QL80_.jpg",
      rating: 4,
      trailerURL: "https://www.youtube.com/embed/zSWdZVtXT7E",
    },
  ]);

  const [titleFilter, setTitleFilter] = useState("");
  const [rateFilter, setRateFilter] = useState(0);
  const [newMovie, setNewMovie] = useState({
    title: "",
    description: "",
    posterURL: "",
    rating: 0,
    trailerURL: "",
  });

  const handleAddMovie = () => {
    if (!newMovie.title || !newMovie.posterURL) return;
    setMovies([...movies, newMovie]);
    setNewMovie({ title: "", description: "", posterURL: "", rating: 0, trailerURL: "" });
  };

  const filteredMovies = movies.filter(
    (movie) =>
      movie.title.toLowerCase().includes(titleFilter.toLowerCase()) &&
      movie.rating >= rateFilter
  );

  return (
    <Router>
      <Routes>
        <Route
          path="/"
          element={
            <div className="p-8 max-w-6xl mx-auto">
              <h1 className="text-3xl font-bold mb-4 text-center">
                🎬 Movie Library
              </h1>

              <Filter
                titleFilter={titleFilter}
                setTitleFilter={setTitleFilter}
                rateFilter={rateFilter}
                setRateFilter={setRateFilter}
              />

              <div className="mt-8 bg-gray-50 p-4 rounded-xl shadow-sm flex flex-col gap-3">
                <h2 className="text-xl font-semibold">Add a New Movie</h2>
                <input
                  placeholder="Title"
                  value={newMovie.title}
                  onChange={(e) =>
                    setNewMovie({ ...newMovie, title: e.target.value })
                  }
                  className="border p-2 rounded-lg"
                />
                <input
                  placeholder="Description"
                  value={newMovie.description}
                  onChange={(e) =>
                    setNewMovie({ ...newMovie, description: e.target.value })
                  }
                  className="border p-2 rounded-lg"
                />
                <input
                  placeholder="Poster URL"
                  value={newMovie.posterURL}
                  onChange={(e) =>
                    setNewMovie({ ...newMovie, posterURL: e.target.value })
                  }
                  className="border p-2 rounded-lg"
                />
                <input
                  placeholder="Trailer Embed URL"
                  value={newMovie.trailerURL}
                  onChange={(e) =>
                    setNewMovie({ ...newMovie, trailerURL: e.target.value })
                  }
                  className="border p-2 rounded-lg"
                />
                <input
                  type="number"
                  min="0"
                  max="5"
                  placeholder="Rating"
                  value={newMovie.rating}
                  onChange={(e) =>
                    setNewMovie({
                      ...newMovie,
                      rating: Number(e.target.value),
                    })
                  }
                  className="border p-2 rounded-lg"
                />
                <button
                  onClick={handleAddMovie}
                  className="bg-blue-600 text-white rounded-lg p-2 mt-2"
                >
                  Add Movie
                </button>
              </div>

              <MovieList movies={filteredMovies} />
            </div>
          }
        />
        <Route path="/movie/:title" element={<MovieDetails movies={movies} />} />
      </Routes>
    </Router>
  );
};

export default App;
