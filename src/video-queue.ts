let videoQueue: string[] = [];

export const getVideoQueue = (): string[] => {
  return videoQueue;
};

export const addVideoToQueue = (url: string): void => {
  videoQueue.push(url);
};

export const getNextVideo = (): string | undefined => {
  const videoUrl = videoQueue.shift();
  return videoUrl;
};

export const emptyVideoQueue = (): void => {
  videoQueue = [];
};
