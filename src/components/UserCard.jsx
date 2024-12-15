import React, { useEffect, useState } from "react";

const UserCard = ({ user }) => {
  const [repos, setRepos] = useState([]);
  const [selectedRepo, setSelectedRepo] = useState(null);
  const [commits, setCommits] = useState([]);
  const [lastCommitDate, setLastCommitDate] = useState(null);
  const [timeElapsed, setTimeElapsed] = useState("");
  const [loadingRepos, setLoadingRepos] = useState(true);
  const [loadingCommits, setLoadingCommits] = useState(false);
  const [error, setError] = useState("");

  // Cargar repositorios del usuario
  useEffect(() => {
    const fetchRepos = async () => {
      try {
        const response = await fetch(user.repos_url);
        if (!response.ok) {
          throw new Error("Error al obtener los repositorios");
        }
        const data = await response.json();
        setRepos(data); // Guardar los repositorios obtenidos
      } catch (err) {
        setError(err.message);
      } finally {
        setLoadingRepos(false);
      }
    };

    fetchRepos();
  }, [user.repos_url]);

  // Manejar selección de repositorio y obtener commits
  const handleRepoSelect = async (repoName) => {
    setSelectedRepo(repoName);
    setCommits([]);
    setLoadingCommits(true);
    setError(null);
    setLastCommitDate(null);

    try {
      const response = await fetch(
        `https://api.github.com/repos/${user.login}/${repoName}/commits`
      );
      if (!response.ok) {
        throw new Error("Error al obtener los commits");
      }

      const data = await response.json();
      setCommits(data);

      if (data.length > 0) {
        const latestCommitDate = new Date(data[0].commit.author.date); // Fecha del último commit
        setLastCommitDate(latestCommitDate);
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoadingCommits(false);
    }
  };

  // Actualizar tiempo transcurrido desde el último commit
  useEffect(() => {
    if (!lastCommitDate) return;

    const calculateTimeElapsed = () => {
      const now = new Date();
      const diff = now - lastCommitDate;

      const seconds = Math.floor(diff / 1000) % 60;
      const minutes = Math.floor(diff / (1000 * 60)) % 60;
      const hours = Math.floor(diff / (1000 * 60 * 60)) % 24;
      const days = Math.floor(diff / (1000 * 60 * 60 * 24));

      const formattedTime = `${days}d ${hours}h ${minutes}m ${seconds}s`;
      setTimeElapsed(formattedTime);
    };

    calculateTimeElapsed(); // Calcular inicialmente

    const interval = setInterval(calculateTimeElapsed, 1000); // Actualizar cada segundo

    return () => clearInterval(interval); // Limpiar intervalo al desmontar
  }, [lastCommitDate]);

  return (
    <div className="flex flex-col items-center gap-4 mt-10 bg-gray-800 p-6 rounded-lg text-white">
      <img
        src={user.avatar_url}
        alt="Avatar"
        className="w-32 h-32 rounded-full"
      />
      <h2 className="text-xl font-bold">{user.name || "Usuario sin nombre"}</h2>
      <p>
        <strong>Usuario:</strong> {user.login}
      </p>
      <p>
        <strong>Repositorios Públicos:</strong> {user.public_repos}
      </p>
      <p>
        <strong>Seguidores:</strong> {user.followers}
      </p>

      <h3 className="text-lg font-semibold mt-6">Repositorios:</h3>
      {loadingRepos && <p>Cargando repositorios...</p>}
      {error && <p style={{ color: "red" }}>{error}</p>}

      <ul className="list-disc list-inside mt-4 w-full">
        {repos.map((repo) => (
          <li
            key={repo.id}
            className="text-sm cursor-pointer hover:underline"
            onClick={() => handleRepoSelect(repo.name)}
          >
            {repo.name}
          </li>
        ))}
      </ul>

      {selectedRepo && (
        <div className="mt-6 w-full">
          <h3 className="text-lg font-semibold">
            Commits de: {selectedRepo}
          </h3>
          {loadingCommits && <p>Cargando commits...</p>}
          <ul className="list-disc list-inside mt-4">
            {commits.map((commit, index) => (
              <li key={index} className="text-sm">
                <p>
                  <strong>Mensaje:</strong> {commit.commit.message}
                </p>
                <p>
                  <strong>Autor:</strong> {commit.commit.author.name}
                </p>
                <p>
                  <strong>Fecha:</strong>{" "}
                  {new Date(commit.commit.author.date).toLocaleString()}
                </p>
              </li>
            ))}
          </ul>

          {lastCommitDate && (
            <div className="mt-4">
              <h4 className="text-md font-semibold">Último Commit:</h4>
              <p>
                <strong>Fecha:</strong>{" "}
                {lastCommitDate.toLocaleString()}
              </p>
              <p>
                <strong>Tiempo Transcurrido:</strong> {timeElapsed}
              </p>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default UserCard;
