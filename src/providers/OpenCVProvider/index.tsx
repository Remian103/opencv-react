import {FC, useEffect, useState} from 'react';
import {OpenCVContext} from './useOpenCV';
import {OpenCVProviderProps} from './types';

const OpenCVProvider: FC<OpenCVProviderProps> = ({url, children}) => {
  const [value, setValue] = useState({
    loaded: false,
    cv: undefined,
  });

  useEffect(() => {
    window.Module = {
      onRuntimeInitialized: () => {
        if(window.cv) {
          setValue({
            loaded: true,
            cv: window.cv,
          });
        }
      }
    }

    const cvScript = document.createElement('script');
    cvScript.src = url || 'opencv.js';
    cvScript.defer = true;
    cvScript.async = true;

    document.body.appendChild(cvScript);
  }, [url, setValue])

  return <OpenCVContext.Provider value={value}>{children}</OpenCVContext.Provider>
}

export default OpenCVProvider;
export {default as useOpenCV} from './useOpenCV';
