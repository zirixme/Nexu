import { useEffect, useState } from "react";
import { InputWithLabel } from "../components/InputWithLabel.jsx";
import { searchUsers } from "../api/auth.js";

export const Search = () => {
  const [query, setQuery] = useState("");
  const [result, setResult] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setQuery(e.target.value);
  };

  useEffect(() => {
    if (query.trim().length === 0) {
      setResult([]);
      return;
    }
    setLoading(true);
    setError("");
    const timer = setTimeout(() => {
      searchUsers(query)
        .then((res) => setResult(res.data))
        .catch(() => setError("Search failed"))
        .finally(() => setLoading(false));
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  return (
    <div className="space-y-8 flex flex-col items-center p-2 w-full max-w-md md:max-w-2xl xl:max-w-md px-4">
      <InputWithLabel
        label={"Search"}
        id={"search"}
        name={"search"}
        type={"search"}
        onChange={handleChange}
        value={query}
      />
      {loading && <p>Loading...</p>}
      {error && <p className="text-red-500">{error}</p>}
      <ul className="w-full">
        {result.map((user) => (
          <li key={user.id} className="border-b p-2">
            <a href={`/profile/${user.id}`}>{user.username}</a>
          </li>
        ))}
      </ul>
    </div>
  );
};
