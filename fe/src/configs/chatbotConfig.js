// import React from "react";
// import { createChatBotMessage } from "react-chatbot-kit";
// import Options from "../Options/Options"
// const config = {
// botName: "LearningBot",
// initialMessages: [
// createChatBotMessage("Hello, Welcome to student info system!", {
// widget: "options",
// })
// ],
// widgets: [
// {
// widgetName: "options",
// widgetFunc: (props) => <Options {...props} />,
// },
// {
// widgetName: "gotIt",
// widgetFunc: (props) => <Options {...props} />,
// }
// ]
// };
// export default config;
import { createChatBotMessage } from "react-chatbot-kit";

const config = {
  // initialMessages: [createChatBotMessage("Xin chào! Tôi có thể giúp gì cho bạn?")],
  initialMessages: [createChatBotMessage("Xin chào! Tôi có thể giúp gì cho bạn?")],
  botName: "Trợ lý Chatbot",
  customStyles: {
    botMessageBox: {
      backgroundColor: "#376B7E",
    },
    chatButton: {
      backgroundColor: "#5ccc9d",
    },
  },
};

export default config;
