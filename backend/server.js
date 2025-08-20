
require("dotenv").config()
const app = require("./src/app");
const main = require("./src/services/ai.service");
const { createServer } = require("http");
const { Server } = require("socket.io");

const httpServer = createServer(app);
const io = new Server(httpServer, {
    cors: {
        origin: "*",

    }
});

const chatHistory = []
io.on("connection", (socket) => {
    console.log("a user is connected");

    socket.on("disconnect", () => {
        console.log("disconnected")
    })

    socket.on("ai-message", async (data) => {
        console.log("data", data);
        chatHistory.push({
            role: "user",
            text: data.prompt
        })
        const response = await main(chatHistory);
        chatHistory.push({
            role: "model",
            text: response
        })
        console.log(response)
        socket.emit("ai-message-response", { response });
    })
});

httpServer.listen(3000, () => {
    console.log("server is running on port 3000")
})