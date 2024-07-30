const state = {
    articles: [],
};

const mutations = {
    setArticles(state, articles) {
        state.articles = articles;
    },
    addArticle(state, article) {
        state.articles.push(article);
    },
    updateArticle(state, updatedArticle) {
        const index = state.articles.findIndex(article => article.id === updatedArticle.id);
        if (index !== -1) {
            Vue.set(state.articles, index, updatedArticle);
        }
    },
    deleteArticle(state, articleId) {
        state.articles = state.articles.filter(article => article.id !== articleId);
    },
};

const actions = {
    async fetchArticles({ commit }) {
        try {
            const response = await fetch('http://localhost:8081/api/article/all');
            const data = await response.json();
            commit('setArticles', data);
        } catch (error) {
            console.error('Error fetching articles:', error);
        }
    },
    async addArticle({ commit }, article) {
        try {
            const response = await fetch('http://localhost:8081/api/article/add', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(article),
            });
            const data = await response.json();
            commit('addArticle', data);
        } catch (error) {
            console.error('Error adding article:', error);
        }
    },
    async updateArticle({ commit }, article) {
        try {
            const response = await fetch(`http://localhost:8081/api/article/update/${article.id}`, {
                method: 'PUT',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(article),
            });
            const data = await response.json();
            commit('updateArticle', data);
        } catch (error) {
            console.error('Error updating article:', error);
        }
    },
    async deleteArticle({ commit }, articleId) {
        try {
            await fetch(`http://localhost:8081/api/article/${articleId}`, {
                method: 'DELETE',
            });
            commit('deleteArticle', articleId);
        } catch (error) {
            console.error('Error deleting article:', error);
        }
    },
};

export default {
    state,
    mutations,
    actions,
};
