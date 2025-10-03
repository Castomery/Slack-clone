import { generateStreamToken } from "../configs/stream.js"

export const getSteramToken = async (req, res) =>{
    try {
        const token = await generateStreamToken(req.auth().userId);

        res.status(200).json({token});

    } catch (error) {
        res.status(500).json({message: "Failed to generate Stream token"});
    }
}