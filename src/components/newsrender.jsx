import { useEffect, useState } from "react";

let Newsapp = () => {
  const apiKey = "e2bb084dd12e4d39bdc54dd63853ab59";

  const [newsData, setNewsData] = useState([]); // rendering news
  const [searchTerm, setSearchTerm] = useState(""); // search news

  //------------------infinite loading-------------
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(false);

  const [selectedSource, setSelectedSource] = useState(""); // search through source

  useEffect(() => {
    const apiUrl = `https://newsapi.org/v2/top-headlines?country=us&apiKey=${apiKey}`;

    // Retrieve the last scroll position from localStorage

    const savedScrollPosition = localStorage.getItem("newsAppScrollPosition");
    if (savedScrollPosition) {
      window.scrollTo(0, parseInt(savedScrollPosition));
    }

    //------------------------infinite scrolling----------------------------
    setLoading(true);
    fetch(apiUrl)
      .then((data) => data.json())
      .then((data) => {
        setNewsData((prevNews) => [...prevNews, ...data.articles]);
        setPage(page + 1);
        console.log("page", page);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching news data:", error);
        setLoading(false);
      });

    // Save the current scroll position to localStorage
    const handleScroll = () => {
      localStorage.setItem("newsAppScrollPosition", window.scrollY);
    };
    window.addEventListener("scroll", handleScroll);

    // Clean up the event listener
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, [page]);
  //------------------------------------------------------

  //----------------------filter news based on the source------------------------
  const filteredNews = newsData.filter((article) => {
    const bySearchTerm = article.title
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    const bySource =
      selectedSource === "" || article.source.name === selectedSource;
    return bySearchTerm && bySource;
  });

  return (
    <div className="news-app">
      <div className="filterbar-parent">
        <div className="filter-bar">
          <button>
            <input
              type="text"
              placeholder="Search news"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </button>

          <button>
            <select
              value={selectedSource}
              onChange={(e) => setSelectedSource(e.target.value)}
            >
              <option value="">All Sources</option>
              {Array.from(
                new Set(newsData.map((article) => article.source.name))
              ).map((source, index) => (
                <option key={index} value={source}>
                  {source}
                </option>
              ))}
            </select>
          </button>
        </div>
      </div>
      <div className="news-grid">
        {filteredNews.map((article, index) => (
          <div key={index} className="news-article">
            <h2>{article.title}</h2>
            <p className="para">{article.description}</p>
            <a href={article.url} target="_blank" rel="noopener noreferrer">
              Read more
            </a>
          </div>
        ))}
      </div>
      {loading && <p>Loading...</p>}
    </div>
  );
};
export default Newsapp;
