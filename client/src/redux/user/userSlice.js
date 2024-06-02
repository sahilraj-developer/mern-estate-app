import {createSlice, current} from '@reduxjs/toolkit'

const initialState ={
    currentUser :null,
    error: null,
    loading:false,
};

const userSlice  = createSlice({
    name:"user",
    initialState,
    reducers:{
        signInStart:(state)=>{
            state.loading=true;
        },
        signInSuccess: (state,action)=>{
            state.currentUser = action.payload;
            state.loading =false;
            state.error = null;
        },
        signInFailure: (state,action)=>{
            state.loading =false;
            state.error = action.payload;
        },
        updateUserStart: (state,action)=>{
            state.loading=true;
        },
        updateUserSuccess: (state,action)=>{
            state.loading =false;
            state.currentUser = action.payload;
            state.error = null;
        },
        updateUserFailure:(state,action)=>{
            state.loading =false;
            state.error = action.payload;
        },
        deleteUserStart:(state)=>{
            state.loading = true;
        },
        deleteUserSuccess:(state)=>{
            state.currentUser = null;
            state.loading = false;
            state.error = null;
        },
        deleteUserFailure:(state)=>{
            state.loading = false;
            state.error = action.payload;
        },
        logoutUserStart:(state)=>{
            state.loading = true;
        },
        logoutUserSuccess:(state)=>{
            state.currentUser = null;
            state.loading = false;
            state.error = null;
        },
        logoutUserFailure:(state)=>{
            state.loading = false;
            state.error = action.payload;
        },

    }
})

export const {signInStart,signInSuccess,signInFailure,updateUserStart,
    updateUserSuccess,updateUserFailure,
    deleteUserStart,deleteUserSuccess,deleteUserFailure,
    logoutUserStart,logoutUserSuccess,logoutUserFailure} = userSlice.actions;

export default userSlice.reducer;