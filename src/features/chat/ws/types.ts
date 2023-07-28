export interface IProfile {
  name: string;
  avatar: unknown; //todo Дополнить интерфейс по ходу дела
}

export interface IAuthor {
  id: string;
  username: string;
  profile: IProfile;
}

export interface IMessage {
  _id: string;
  _key: string;
  text: string;
  author: IAuthor;
  dateCreate: string;
}

export interface IAuthPayload {
  result: boolean;
}

export interface ILastPayload {
  items: IMessage[];
}

export interface IEventData<Method, Payload> {
  method: Method;
  payload: Payload;
}

type TAuthEventData = IEventData<'auth', IAuthPayload>;
type ILastEventData = IEventData<'last', ILastPayload>;
type TPostEventData = IEventData<'post', IMessage>;
type TCLearEventData = IEventData<'clear', object>;
type TOldEventData = IEventData<'old', ILastPayload>;


export type TChatEventData = TAuthEventData | ILastEventData | TPostEventData | TCLearEventData | TOldEventData;
