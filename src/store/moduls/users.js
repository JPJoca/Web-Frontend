const state = {
    users: [],
    newUser: {
        name: '',
        email: '',
        type: 'editor',
        password: ''
    },
    currentUser: null,
    confirmPassword: '',
};

const mutations = {
    setUsers(state, users) {
        state.users = users;
    },
    setNewUser(state, newUser) {
        state.newUser = newUser;
    },
    setCurrentUser(state, user) {
        state.currentUser = user;
    },
    clearNewUser(state) {
        state.newUser = { name: '', email: '', type: 'editor', password: '' };
        state.confirmPassword = '';
    },
};

const actions = {
    async fetchUsers({ commit }) {
        try {
            const response = await fetch('/users');
            const data = await response.json();
            commit('setUsers', data);
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    },
    async addUser({ dispatch, state }) {
        if (state.newUser.password !== state.confirmPassword) {
            alert("Passwords do not match");
            return;
        }
        try {
            await fetch('/users/admin/adduser', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(state.newUser)
            });
            dispatch('fetchUsers');
            commit('clearNewUser');
        } catch (error) {
            console.error('Error adding user:', error);
        }
    },
    editUser({ commit }, user) {
        commit('setCurrentUser', { ...user });
    },
    async updateUser({ dispatch, state }) {
        try {
            await fetch(`/users/admin/updateuser/${state.currentUser.id}`, {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(state.currentUser)
            });
            dispatch('fetchUsers');
            commit('setCurrentUser', null);
        } catch (error) {
            console.error('Error updating user:', error);
        }
    },
    async toggleUserStatus({ dispatch }, userId) {
        try {
            await fetch(`/users/admin/updatestatus/${userId}`, {
                method: 'PUT'
            });
            dispatch('fetchUsers');
        } catch (error) {
            console.error('Error toggling user status:', error);
        }
    }
};

export default {
    state,
    mutations,
    actions,
};
