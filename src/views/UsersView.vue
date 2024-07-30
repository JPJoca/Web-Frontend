<template>
  <div class="users">
    <h2>Users</h2>
    <div v-if="showTable">
      <table class="user-table">
        <thead>
        <tr>
          <th>First Name</th>
          <th>Last Name</th>
          <th>Email</th>
          <th>User Type</th>
          <th>Status</th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="user in paginatedUsers" :key="user.id">
          <td>{{ user.firstName }}</td>
          <td>{{ user.lastName }}</td>
          <td>{{ user.email }}</td>
          <td>{{ user.userType }}</td>
          <td>
            <button :class="user.status" v-if="user.userType === 'editor'" @click="toggleUserStatus(user.id)">
              {{ user.status === "inactive" ? 'Inactive' : 'Active' }}
            </button>
          </td>
          <td>
            <button @click="edit(user)">Edit</button>
          </td>
        </tr>
        </tbody>
      </table>
      <div class="pagination">
        <button @click="prevPage" :disabled="currentPage === 1" :class="{ 'disabled-button': currentPage === 1 }">&lt;</button>
        <span>{{ currentPage }} / {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages" :class="{ 'disabled-button': currentPage === totalPages }">&gt;</button>
      </div>
      <button @click="showAddForm = true; showTable = false">Add User</button>
    </div>

    <form v-if="showAddForm" @submit.prevent="add">
      <h3>Add New User</h3>
      <label for="firstName">First Name:</label>
      <input type="text" v-model="newUser.firstName" required />
      <label for="lastName">Last Name:</label>
      <input type="text" v-model="newUser.lastName" required />
      <label for="email">Email:</label>
      <input type="email" v-model="newUser.email" required />
      <label for="type">Type:</label>
      <select v-model="newUser.userType" required>
        <option value="admin">Administrator</option>
        <option value="editor">Editor</option>
      </select>
      <label for="password">Password:</label>
      <input type="password" v-model="newUser.hashedPassword" required />
      <label for="confirmPassword">Confirm Password:</label>
      <input type="password" v-model="confirmPassword" required />
      <button type="submit">Add</button>
      <button type="button" @click="showAddForm = false; showTable = true">Cancel</button>
    </form>

    <form v-if="showEditForm" @submit.prevent="update">
      <h3>Edit User</h3>
      <label for="name">First Name:</label>
      <input type="text" v-model="currentUser.firstName" required />
      <label for="name">Last Name:</label>
      <input type="text" v-model="currentUser.lastName" required />
      <label for="email">Email:</label>
      <input type="email" v-model="currentUser.email" required />
      <label for="type">Type:</label>
      <select v-model="currentUser.userType" required>
        <option value="admin">Administrator</option>
        <option value="editor">Editor</option>
      </select>
      <button type="submit">Update</button>
      <button type="button" @click="showEditForm = false; showTable = true">Cancel</button>
    </form>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  data() {
    return {
      showAddForm: false,
      showEditForm: false,
      showTable: true,
      confirmPassword: '',
      currentPage: 1,
      usersPerPage: 5,
    };
  },
  computed: {
    ...mapState(['users', 'newUser', 'currentUser']),
    paginatedUsers() {
      const start = (this.currentPage - 1) * this.usersPerPage;
      const end = start + this.usersPerPage;
      return this.users.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.users.length / this.usersPerPage);
    }
  },
  methods: {
    ...mapActions(['fetchUsers', 'addUser', 'editUser', 'updateUser', 'toggleUserStatus']),
    update() {
      this.updateUser();
      this.showEditForm = false;
      this.showTable = true;
    },
    add() {
      this.addUser(this.confirmPassword);
      this.showAddForm = false;
      this.showTable = true;
      this.confirmPassword = '';
    },
    edit(user) {
      this.editUser(user);
      this.showEditForm = true;
      this.showTable = false;
    },
    nextPage() {
      if (this.currentPage < this.totalPages) {
        this.currentPage++;
      }
    },
    prevPage() {
      if (this.currentPage > 1) {
        this.currentPage--;
      }
    },
  },
  mounted() {
    this.fetchUsers();
  }
};
</script>

<style scoped>

tr:nth-child(even) {
  background-color: #f2f2f2; /* Light gray background */
}

/* Apply styles to odd rows (1st, 3rd, 5th, ...) */
tr:nth-child(odd) {
  background-color: #ffffff; /* White background */
}

/* Optional: Hover effect */
tr:hover {
  background-color: #e1e1e1; /* Light gray background on hover */
}

.users {
  padding: 20px;
}

.active {
  background-color: #5cc910;
  color: #f9f9f9;
}

.inactive {
  background-color: red;
  color: #f9f9f9;
}

.user-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
}

.user-table th, .user-table td {
  padding: 15px;
  border: 1px solid #ccc;
}

.user-table th {
  background-color: #2c3e50;
  color: white;
}

.user-table td {
  max-width: 200px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

button {
  background-color: #5cc910;
  color: white;
  cursor: pointer;
  padding: 10px 15px;
  font-size: 14px;
  margin: 5px;
  border: none;
  border-radius: 4px;
}

form {
  margin-top: 20px;
  padding: 20px;
  border: 1px solid #ccc;
  border-radius: 5px;
  background-color: #f9f9f9;
}

form label {
  display: block;
  margin-bottom: 5px;
}

form input[type="text"],
form input[type="email"],
form input[type="password"],
form select {
  width: 100%;
  padding: 8px;
  margin-bottom: 10px;
  border: 1px solid #ccc;
  border-radius: 4px;
}

.pagination {
  display: flex;
  justify-content: flex-end;
  align-items: center;
  margin-top: 20px;
}

.pagination button {
  background-color: #5cc910;
  color: white;
  margin: 0 5px;
}

.pagination span {
  margin: 0 10px;
}
.pagination button:disabled {
  background-color: #cccccc;
  color: #666666;
  cursor: not-allowed;
}

.pagination span {
  margin: 0 10px;
}
</style>
