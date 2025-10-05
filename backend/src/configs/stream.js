import {StreamChat} from "stream-chat";
import {ENV} from "./env.js";

const streamClient = StreamChat.getInstance(ENV.STREAM_API_KEY, ENV.STREAM_API_SECRET);

export const upsertStreamUser = async(userData) => {
    try {
        await streamClient.upsertUser(userData);
        console.log("Stream user upserted:", userData.name);
        return userData;
    } catch (error) {
        console.log("Error:", error);
    }
}

export const deleteStreamUser = async(userId) => {
    try {
        await streamClient.deleteUser(userId);
        console.log("Stream user deleted");
    } catch (error) {
        console.log("Error:", error);
    }
}

export const generateStreamToken = (userId) => {
    try {
        const userIdString = userId.toString();
        return streamClient.createToken(userIdString);
    } catch (error) {
        console.log("Error:", error);
        return null;
    }
}

export const addUserToPublicChannels = async(newUserId) => {
    const publicChannels = await streamClient.queryChannels({discoverable:true});
    for(const channel of publicChannels){
        await channel.addMembers([newUserId]);
    }
}