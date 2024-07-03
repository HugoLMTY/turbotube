export enum EThumbSizes {
  default = 'default',
  medium = 'medium',
  high = 'high',
  standard = 'standard',
  maxres = 'maxres',
}

export interface IThumbnail {
  url: string;
  width: number;
  height: number;
}

export interface IThumbnails {
  default: IThumbnail;
  medium: IThumbnail;
  high: IThumbnail;
  standard: IThumbnail;
  maxres: IThumbnail;
}

interface IResponseObject {
  item: object;
  id: string;

  thumbnails: IThumbnails;
}

export interface IVideo extends IResponseObject {
  videoId: string;
  playlistId: string;

  title: string;
  description: string;
  videoOwnerChannelTitle: string;

  video: {
    id: string;
    player: {
      embedHtml: string;
    };
  };

  position: number;

  hover?: boolean;
  hovers: {
    queue: boolean;
  };
}

export interface IPlaylist extends IResponseObject {
  title: string;
  author: string;

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  items: IVideo[];
  count: number;

  player: string;
  showDetails: boolean;

  hover: {
    play: boolean;
    shuffle: boolean;
    list: boolean;
  };

  loading: {
    items: boolean;
  };
}
