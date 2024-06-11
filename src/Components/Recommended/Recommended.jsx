import { useState, useEffect } from "react";
import "./Recommended.css";
import { API_KEY, value_convertor } from "../../data";
import axios from "axios";
import { Link, useParams } from "react-router-dom";

const Recommended = () => {

    const {categoryId} = useParams()

  const [apiData, setApiData] = useState([]);

  const fetchData = async () => {
    const relatedVideoUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&chart=mostPopular&maxResults=45&regionCode=US&videoCategoryId=${categoryId}&key=${API_KEY}`;
    try {
      const response = await axios.get(relatedVideoUrl);
      setApiData(response.data.items);
    } catch (error) {
      console.error('Error fetching video data: ', error);
    }
  };

  useEffect(() => {
    fetchData();
  }, [categoryId]);

  return (
    <div className="recommended">
      {apiData.map((item, index) => (
        <Link to={`/video/${item.snippet.categoryId}/${item.id}`} key={index} className="side-video-list">
          <img src={item.snippet.thumbnails.medium.url} alt={item.snippet.title} />
          <div className="vid-info">
            <h4>{item.snippet.title}</h4>
            <p>{item.snippet.channelTitle}</p>
            <p>{value_convertor(item.statistics.viewCount)} Views</p>
          </div>
        </Link>
      ))}
    </div>
  );
};

export default Recommended;
