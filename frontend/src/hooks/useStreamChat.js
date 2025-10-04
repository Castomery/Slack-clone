import {useState, useEffect} from "react";
import { StreamChat } from "stream-chat";
import { useUser } from "@clerk/clerk-react";
import { useQuery } from "@tanstack/react-query";
import { getStreamToken } from "../configs/api";
import * as Sentry from "@sentry/react";

const STREAM_API_KEY = import.meta.env.STREAM_API_KEY;

export const useStreamChat = () => {
    const {user} = useUser();
    const [chatClient, setChatClient] = useState(null);

    const {data: tokenData, isLoading:tokenLoading, error: tokenError} = useQuery(
        {
            queryKey: ["streamToken"],
            queryFn: getStreamToken,
            enabled: !!user?.id,
        }
    );

    useEffect(() => {
        let cancelled = false;

        const initChat = async() => {
            if(!tokenData?.token || !user) return;

            try {
                const client =StreamChat.getInstance(STREAM_API_KEY);
                await client.connectUser({
                    id:user.id,
                    name:user.fullName,
                    image:user.imageUrl,
                })

                if(!cancelled) setChatClient(client);
            } catch (error) {
                console.log("Error:", error);
                Sentry.captureException(error, {
                    tags: {component: "useStreamChat"},
                })
            }
        }

        initChat();

        return () => {
            cancelled = true;
            chatClient.disconnectUser();
        }
    },[tokenData?.token, user?.id]);

    return {chatClient, isLoading:tokenLoading, error: tokenError}
}