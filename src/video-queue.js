let videoQueue = [];

export const getVideoQueue = () => {
  return videoQueue;
};

export const addVideoToQueue = (url) => {
  videoQueue.push(url);
};

export const getNextVideo = () => {
  const videoUrl = videoQueue.shift();
  return videoUrl;
};

export const emptyVideoQueue = () => {
  videoQueue = [];
};
