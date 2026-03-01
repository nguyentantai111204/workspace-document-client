import { useEffect } from "react";
import { useFcm } from "../../hooks/use-fcm.hook";

export const FcmInitializer = () => {
    const { requestPermission } = useFcm();

    useEffect(() => {
        requestPermission();
    }, [requestPermission]);

    return null;
};
