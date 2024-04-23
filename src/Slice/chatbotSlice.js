import { createSlice } from "@reduxjs/toolkit";

const findIndexWithBotId = (arr, botId) => {
  return arr.findIndex((d) => d._id === botId);
};

export const chatbotSlice = createSlice({
  name: "chatbot",
  initialState: {
    chatbots: [],
  },
  reducers: {
    setChatBots: (state, action) => {
      state.chatbots = [...action.payload];
    },
    updateChatbot: (state, action) => {
      const index = findIndexWithBotId(state.chatbots, action.payload.id);
      state.chatbots = [
        ...state.chatbots.slice(0, index),
        {
          ...state.chatbots[index],
          ...action.payload.data,
        },
        ...state.chatbots.slice(index + 1),
      ];
    },
    addChatBot: (state, action) => {
      state.chatbots = [...state.chatbots, action.payload];
    },
    deleteChatbot: (state, action) => {
      const index = findIndexWithBotId(state.chatbots, action.payload);
      state.chatbots = state.chatbots
        .slice(0, index)
        .concat(state.chatbots.slice(index + 1));
    },
    addNewUrl: (state, action) => {
      const index = findIndexWithBotId(state.chatbots, action.payload.id);
      state.chatbots = [
        ...state.chatbots.slice(0, index),
        {
          ...state.chatbots[index],
          pages: [...state.chatbots[index].pages, ...action.payload.links],
        },
        ...state.chatbots.slice(index + 1),
      ];
    },
    addNewFile: (state, action) => {
      const index = findIndexWithBotId(state.chatbots, action.payload.id);
      state.chatbots = [
        ...state.chatbots.slice(0, index),
        {
          ...state.chatbots[index],
          files: [...state.chatbots[index].files, ...action.payload.files],
        },
        ...state.chatbots.slice(index + 1),
      ];
    },
    setVocieId: (state, action) => {
      const index = findIndexWithBotId(state.chatbots, action.payload.id);
      state.chatbots = [
        ...state.chatbots.slice(0, index),
        {
          ...state.chatbots[index],
          voiceId: action.payload.voiceId,
        },
        ...state.chatbots.slice(index + 1),
      ];
    },
    toggleActive: (state, action) => {
      const index = findIndexWithBotId(state.chatbots, action.payload);
      state.chatbots = [
        ...state.chatbots.slice(0, index),
        {
          ...state.chatbots[index],
          active: !state.chatbots[index].active,
        },
        ...state.chatbots.slice(index + 1),
      ];
    },
  },
});

export const {
  setChatBots,
  addChatBot,
  deleteChatbot,
  addNewUrl,
  addNewFile,
  setVocieId,
  toggleActive,
  updateChatbot
} = chatbotSlice.actions;

export default chatbotSlice.reducer;
