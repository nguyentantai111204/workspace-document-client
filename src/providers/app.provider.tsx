import { AuthInitializer } from "../components/initializers/auth-initializer.component";
import { FcmInitializer } from "../components/initializers/fcm-initializer.component";
import { BrowserRouter } from "react-router-dom";

interface AppProviderProps {
    children: React.ReactNode;
}

export const AppProvider = ({ children }: AppProviderProps) => {
    return (
        <>
            <AuthInitializer />
            <FcmInitializer />
            <BrowserRouter>
                {children}
            </BrowserRouter>
        </>
    );
};
