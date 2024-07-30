import { jwtDecode } from "jwt-decode";

const state = {
    isLoggedIn: !!localStorage.getItem('jwt'),
    userType: null,
    email: null,
};

const mutations = {
    setEmail(state, email) {
        state.email = email;
    },
    setLoggedIn(state, isLoggedIn) {
        state.isLoggedIn = isLoggedIn;
    },
    setUserType(state, userType) {
        state.userType = userType;
    },
};

const actions = {
    login({ commit }, jwt) {
        localStorage.setItem('jwt', jwt);
        const decoded = jwtDecode(jwt);
        commit('setLoggedIn', true);
        commit('setUserType', decoded.userType);
        commit('setEmail', decoded.sub);
    },
    logout({ commit }) {
        localStorage.removeItem('jwt');
        commit('setLoggedIn', false);
        commit('setUserType', null);
        commit('setEmail', null);
    },
};

export default {
    state,
    mutations,
    actions,
};
