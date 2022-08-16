import {ReactNode} from 'react';

export interface OpenCVContextProps {
  loaded: boolean;
  cv: any;
}

export interface OpenCVProviderProps {
  url?: string;
  children: ReactNode;
}
