import ytdl from "@distube/ytdl-core";
import cookies from '../youtube-cookies.json' assert { type: 'json' };

const agent = ytdl.createAgent(cookies);

const getYtdlAgent = () => {
  return agent;
};

export { getYtdlAgent };
