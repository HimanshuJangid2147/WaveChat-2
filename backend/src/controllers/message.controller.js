import Message from "../models/message.model.js";
import User from "../models/user.model.js";
import cloudinary from "../lib/cloudinary.js";
import { io, getReceiverSocketId } from "../lib/socket.js";

export const getUsersForSidebar = async(req, res) => {
    try {
        const loggedInUserId = req.user._id;
        const filteredUsers = await User.find({ _id: { $ne: loggedInUserId } }).select("-password");
        
        if (!filteredUsers.length) {
            return res.status(404).json({ error: 'No users available' });
        }
        
        res.status(200).json(filteredUsers);

    } catch (error) {
        console.log("Error in getUsersForSidebar", error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};  

export const getMessages = async(req, res) => {
    try { 
        const { id: userToChatId } = req.params;
        const myId = req.user._id;

        const messages = await Message.find({
            $or: [
                { senderId: myId, receiverId: userToChatId },
                { senderId: userToChatId, receiverId: myId },
            ],
        });
        if (!messages.length) {
            return res.status(404).json({ error: 'No messages found' });
        }
        res.status(200).json(messages);

    } catch (error) {
        console.log("Error in getMessages", error.message);
        res.status(500).json({ error: 'Internal server error' });
    }
};

export const sendMessage = async(req, res) => {
        try {
            const { text, image } = req.body;
            const { id: receiverId } = req.params;
            const myId = req.user._id;

            if (!text && !image) {
                return res.status(400).json({ error: 'Text or image is required' });
            }

            if (!receiverId) {
                return res.status(400).json({ error: 'Receiver ID is required' });
            }

            let imageUrl;
            if (image) {
                try {
                    const uploadResponse = await cloudinary.uploader.upload(image);
                    imageUrl = uploadResponse.secure_url;
                } catch (uploadError) {
                    console.error("Error uploading image:", uploadError);
                    return res.status(500).json({ error: 'Failed to upload image' });
                }
            }

            const newMessage = await Message.create({
                senderId: myId,
                receiverId,
                text: text,
                image: imageUrl,
            })
            
            await newMessage.save();

            // Emit event via Socket.io for real-time updates
            const receiverSocketId = getReceiverSocketId(receiverId);
            if (receiverSocketId) {
                io.to(receiverSocketId).emit("newMessage", newMessage);
            }

            res.status(201).json(newMessage);

        } catch (error) {
            console.log("Error in sending message: " + error.message);
            res.status(500).json({ error: 'Internal server error' });
        }
};