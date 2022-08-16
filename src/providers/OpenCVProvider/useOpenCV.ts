import {createContext, useContext} from 'react';
import {OpenCVContextProps} from './types';

export const OpenCVContext = createContext<OpenCVContextProps>({
  loaded: false,
  cv: undefined,
});

const useOpenCV = () => {
  return useContext(OpenCVContext);
}

export default useOpenCV;
