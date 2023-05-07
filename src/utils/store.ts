import React, { useMemo, useContext, useState, useEffect } from 'react';

function makeStore<T = {}>() {
  type TT = [T, (v: Partial<T>) => void];
  // type TT = [T, React.Dispatch<React.SetStateAction<T>>];
  type ProviderProps = {
    children: JSX.Element;
    initialValue?: T;
    watchingValue?: Partial<T>;
  };

  const context = React.createContext<TT>((null as unknown) as TT);

  const Provider = ({ children, initialValue, watchingValue }: ProviderProps) => {
    const [globalState, setGlobalState] = useState<T>((initialValue || {}) as T);

    useEffect(() => {
      setGlobalState(g => ({ ...g, ...watchingValue }));
    }, [watchingValue]);

    const contextValue = useMemo<TT>(
      () => [
        { ...globalState },
        val => {
          setGlobalState(g => ({ ...g, ...val }));
        },
      ],
      [globalState, watchingValue],
    );

    return React.createElement(context.Provider, {
      value: contextValue,
      children,
    });
  };

  const useStore = () => useContext(context);

  return {
    Provider,
    useStore,
  };
}

export default makeStore;
