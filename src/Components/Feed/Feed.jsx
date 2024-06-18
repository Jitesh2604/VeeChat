import { useState, useEffect } from 'react';
import axios from 'axios';
import './Feed.css';
import { Link } from 'react-router-dom';
import { API_KEY, value_convertor } from '../../data';
import moment from 'moment';

const Feed = ({ category, query }) => {
  const [data, setData] = useState([]);

  const fetchData = async () => {
    if (query == ""){
      const videoListUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&chart=mostPopular&maxResults=50&regionCode=US&videoCategoryId=${category}&key=${API_KEY}`;
      try {
        const response = await axios.get(videoListUrl);
        setData(response.data.items);
        // console.log(data);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    }
    else{
      const searchUrl = `https://www.googleapis.com/youtube/v3/search?part=snippet&type=video&maxResults=50&q=${query}&videoCategoryId=${category}&key=${API_KEY}`;
      try {
        const response = await axios.get(searchUrl);
        setData(response.data.items);
        // console.log(data)
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    }

  };



  useEffect(() => {
    fetchData();
  }, [category, query]);

  return (
    <div className="feed">
      {data.map((item, index) => (
        <Link to={`video/${item.snippet.categoryId}/${item.id}`} key={index} className="card">
          <img src={item.snippet.thumbnails.medium.url} alt={item.snippet.title} />
          <h2>{item.snippet.title}</h2>
          <h3>{item.snippet.channelTitle}</h3>
          <p>
            {value_convertor(item.statistics.viewCount)} views &bull; {moment(item.snippet.publishedAt).fromNow()}
          </p>
        </Link>
      ))}
    </div>
  );
};

export default Feed;