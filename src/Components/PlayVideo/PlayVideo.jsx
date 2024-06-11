import { useState, useEffect } from 'react';
import './PlayVideo.css';
import like from '../../assets/like.png';
import dislike from '../../assets/dislike.png';
import share from '../../assets/share.png';
import save from '../../assets/save.png';
import { API_KEY, value_convertor } from '../../data';
import axios from 'axios';
import moment from 'moment';
import { useParams } from 'react-router-dom';

const PlayVideo = () => {

  const {videoId} = useParams()

  const [apiData, setApiData] = useState(null);
  const [channelData, setChannelData] = useState(null);
  const [commentData, setCommentData] = useState([]);

  const fetchVideoData = async () => {
    const videoDetailsUrl = `https://www.googleapis.com/youtube/v3/videos?part=snippet,contentDetails,statistics&id=${videoId}&key=${API_KEY}`;
    try {
      const response = await axios.get(videoDetailsUrl);
      setApiData(response.data.items[0]);
    } catch (error) {
      console.error('Error fetching video data: ', error);
    }
  };

  const fetchOtherData = async () => {
    if (!apiData) return;

    const channelDataUrl = `https://www.googleapis.com/youtube/v3/channels?part=snippet,statistics&id=${apiData.snippet.channelId}&key=${API_KEY}`;
    try {
      const response = await axios.get(channelDataUrl);
      setChannelData(response.data.items[0]);
    } catch (error) {
      console.error('Error fetching channel data: ', error);
    }

    const commentDataUrl = `https://www.googleapis.com/youtube/v3/commentThreads?part=snippet,replies&videoId=${videoId}&key=${API_KEY}`;
    try {
      const response = await axios.get(commentDataUrl);
      setCommentData(response.data.items);
    } catch (error) {
      console.error('Error fetching comment data: ', error);
    }
  };

  useEffect(() => {
    fetchVideoData();
  }, [videoId]);

  useEffect(() => {
    fetchOtherData();
  }, [apiData]);

  return (
    <div className="play-video">
      <iframe
        src={`https://www.youtube.com/embed/${videoId}?autoplay=1`}
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
        referrerPolicy="strict-origin-when-cross-origin"
        allowFullScreen
        title="YouTube video player"
      ></iframe>
      <h3>{apiData ? apiData.snippet.title : 'Title Here'}</h3>
      <div className="play-video-info">
        <p>
          {apiData ? value_convertor(apiData.statistics.viewCount) : '16K'} Views &bull; {apiData ? moment(apiData.snippet.publishedAt).fromNow() : ''}
        </p>
        <div>
          <span>
            <img src={like} alt="like" />
            {apiData ? value_convertor(apiData.statistics.likeCount) : 155}
          </span>
          <span>
            <img src={dislike} alt="dislike" />
          </span>
          <span>
            <img src={share} alt="share" />
            Share
          </span>
          <span>
            <img src={save} alt="save" />
            Save
          </span>
        </div>
      </div>
      <hr />
      <div className="publisher">
        <img src={channelData ? channelData.snippet.thumbnails.default.url : ''} alt="channel" />
        <div>
          <p>{apiData ? apiData.snippet.channelTitle : ''}</p>
          <span>{channelData ? value_convertor(channelData.statistics.subscriberCount) : '1M'} Subscribers</span>
        </div>
        <button>Subscribe</button>
      </div>
      <div className="vid-description">
        <p>{apiData ? apiData.snippet.description.slice(0, 250) : 'Description Here'}</p>
        <hr />
        <h4>{apiData ? value_convertor(apiData.statistics.commentCount) : 102} Comments</h4>
        {commentData.map((item, index) => {
          const comment = item.snippet.topLevelComment.snippet;
          return (
            <div key={index} className="comment">
              <img src={comment.authorProfileImageUrl} alt="author" />
              <div>
                <h3>
                  {comment.authorDisplayName} <span>{moment(comment.publishedAt).fromNow()}</span>
                </h3>
                <p>{comment.textDisplay}</p>
                <div className="comment-action">
                  <img src={like} alt="like" />
                  <span>{value_convertor(comment.likeCount)}</span>
                  <img src={dislike} alt="dislike" />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};

export default PlayVideo;
