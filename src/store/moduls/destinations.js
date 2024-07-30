const state = {
    destinations: [],
};

const mutations = {
    setDestinations(state, destinations) {
        state.destinations = destinations;
    },
    addDestination(state, destination) {
        state.destinations.push(destination);
    },
    deleteDestination(state, id) {
        state.destinations = state.destinations.filter(destination => destination.id !== id);
    },
    updateDestination(state, updatedDestination) {
        const index = state.destinations.findIndex(destination => destination.id === updatedDestination.id);
        if (index > -1) {
            Vue.set(state.destinations, index, updatedDestination);
        }
    },
};

const actions = {
    async fetchDestinations({ commit }) {
        try {
            const response = await fetch('http://localhost:8081/api/destination/all');
            const data = await response.json();
            commit('setDestinations', data);
        } catch (error) {
            console.error('Error fetching destinations:', error);
        }
    },
    async addDestination({ commit }, newDestination) {
        try {
            const response = await fetch('http://localhost:8081/api/destination/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(newDestination)
            });
            const data = await response.json();
            commit('addDestination', data);
        } catch (error) {
            console.error('Error adding destination:', error);
        }
    },
    async updateDestination({ commit }, updatedDestination) {
        try {
            const response = await fetch(`http://localhost:8081/api/destination/update/${updatedDestination.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify(updatedDestination)
            });
            if (response.ok) {
                const data = await response.json();
                commit('updateDestination', data);
            } else {
                throw new Error(`HTTP error! Status: ${response.status}`);
            }
        } catch (error) {
            console.error('Error updating destination:', error);
        }
    },
    async deleteDestination({ commit }, id) {
        try {
            await fetch(`http://localhost:8081/api/destination/${id}`, {
                method: 'DELETE'
            });
            commit('deleteDestination', id);
        } catch (error) {
            console.error('Error deleting destination:', error);
        }
    },
};

export default {
    state,
    mutations,
    actions,
};
