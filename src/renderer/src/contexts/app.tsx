import React from 'react';
import { GeneralProvider } from './general';

export function AppProvider({ children }: { children: React.ReactNode }) {
    return <GeneralProvider>{children}</GeneralProvider>;
}
