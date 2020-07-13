import { Module } from "vuex";
import { RootState } from "../index";

import state, { AuthState } from "./state";
import actions from "./actions";
import getters from "./getters";
import mutations from "./mutations";

const auth: Module<AuthState, RootState> = {
    namespaced: true,
    actions,
    getters,
    mutations,
    state
};

export default auth;
