let trackQueue = [];

export const getTrackQueue = () => {
  return trackQueue;
};

export const addTrackToQueue = (url) => {
  trackQueue.push(url);
};

export const removeFromTrackQueue = () => {
  trackQueue.shift();
};

export const getNextTrack = () => {
  const trackUrl = trackQueue.shift();
  return trackUrl;
};

export const emptyTrackQueue = () => {
  trackQueue = [];
};
