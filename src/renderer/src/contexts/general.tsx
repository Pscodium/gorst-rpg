import React, { createContext, useContext, useState } from 'react';

interface GeneralContextProps {
    screen: ScreenStepType;
    setScreen: React.Dispatch<React.SetStateAction<ScreenStepType>>;
}

const GeneralContext = createContext<GeneralContextProps>({} as GeneralContextProps);

function GeneralProvider({ children }: { children: React.ReactNode }) {
    const [screen, setScreen] = useState<ScreenStepType>('Menu');

    return (
        <GeneralContext.Provider
            value={{
                screen,
                setScreen,
            }}
        >
            <>{children}</>
        </GeneralContext.Provider>
    );
}

const useGeneral = () => {
    const context = useContext(GeneralContext);
    return context;
};

export { GeneralProvider, useGeneral, GeneralContext };
