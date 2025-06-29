
export interface FaceBoundingBox {
  x: number;
  y: number;
  width: number;
  height: number;
}

export interface Contact {
  id: string;
  chineseName: string | null;
  englishName: string | null;
  company: string | null;
  title: string | null;
  phone: string | null;
  email: string | null;
  industry: string;
  avatarUrl: string | null;
  originalCardUrl: string;
  createdAt: string;
}

export enum Theme {
  Light = 'light',
  Dark = 'dark',
}