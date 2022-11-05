import { createSlice } from "@reduxjs/toolkit";
import professionService from "../services/profession.service";

const professionsSlice = createSlice({
   name: "professions",
   initialState: {
      entities: null,
      isLoading: true,
      error: null,
      lastFetch: null
   },
   reducers: {
      professionsRequested: (state) => {
         state.isLoading = true;
      },
      professionsRecieved: (state, action) => {
         state.entities = action.payload;
         state.lastFetch = Date.now();
         state.isLoading = false;
      },
      professionsRequestedFailed: (state, action) => {
         state.error = action.payload;
         state.isLoading = false;
      }
   }
});

const { reducer: professionsReducer, actions } = professionsSlice;
const { professionsRequested, professionsRecieved, professionsRequestedFailed } = actions;
function isOutDated(date) {
   if (Date.now() - date > 10 * 60 * 100) {
      return true;
   }
   return false;
}
export const loadProfessionsList = () => async (dispatch, getState) => {
   const { lastFetch } = getState().professions;
   if (isOutDated(lastFetch)) {
      dispatch(professionsRequested());
      try {
         const { content } = await professionService.get();
         dispatch(professionsRecieved(content));
      } catch (error) {
         dispatch(professionsRequestedFailed(error.message));
      }
   }
};

export const getProfessions = () => (state) => state.professions.entities;
export const getProfessionsLoadingStatus = () => (state) => state.professions.isLoading;
export const getProfessionByIds = (professionByIds) => (state) => {
   if (state.professions.entities) {
      let currentProfession = {};
      for (const profession of state.professions.entities) {
         if (profession._id === professionByIds) {
            currentProfession = profession;
       }
      }
      return currentProfession;
   }
   return {};
};

export default professionsReducer;
