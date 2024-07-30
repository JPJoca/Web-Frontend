<template>
  <div class="destinations">
    <h2>Destinations</h2>
    <div v-if="showTable">
      <table class="destination-table">
        <thead>
        <tr>
          <th>Name</th>
          <th>Description</th>
          <th>Actions</th>
        </tr>
        </thead>
        <tbody>
        <tr v-for="destination in paginatedDestinations" :key="destination.id" @click.prevent="openD(destination.id)">
          <td class="name-cell">{{ destination.name }}</td>
          <td>{{ destination.description.length > 200 ? destination.description.substring(0, 200) + '...' : destination.description }}</td>
          <td class="actions-cell">
            <button class="action-button edit" @click="editDestination(destination)">Update</button>
            <button class="action-button delete" @click.stop="deleteDestination(destination.id)">Delete</button>
          </td>
        </tr>
        </tbody>
      </table>
      <div class="pagination">
        <button @click="prevPage" :disabled="currentPage === 1">&lt;</button>
        <span>{{ currentPage }} / {{ totalPages }}</span>
        <button @click="nextPage" :disabled="currentPage === totalPages">&gt;</button>
      </div>
      <button class="add-button" @click="showAddForm = true, showTable = false">Add Destination</button>
    </div>
    <form v-if="showAddForm" @submit.prevent="add">
      <h3>Add New Destination</h3>
      <label for="name">Name:</label>
      <input type="text" v-model="newDestination.name" required />
      <label for="description">Description:</label>
      <textarea v-model="newDestination.description" required></textarea>
      <button type="submit" class="form-button">Add</button>
      <button type="button" class="form-button cancel" @click="showAddForm = false, showTable = true">Cancel</button>
    </form>
    <form v-if="showEditForm" @submit.prevent="update">
      <h3>Edit Destination</h3>
      <label for="name">Name:</label>
      <input type="text" v-model="currentDestination.name" required />
      <label for="description">Description:</label>
      <textarea v-model="currentDestination.description" required></textarea>
      <button type="submit" class="form-button">Update</button>
      <button type="button" class="form-button cancel" @click="showEditForm = false, showTable = true">Cancel</button>
    </form>
  </div>
</template>

<script>
import { mapState, mapActions } from 'vuex';

export default {
  data() {
    return {
      newDestination: {
        name: '',
        description: ''
      },
      currentDestination: null,
      showAddForm: false,
      showEditForm: false,
      showTable: true,
      currentPage: 1,
      itemsPerPage: 4
    };
  },
  computed: {
    ...mapState(['destinations']),
    paginatedDestinations() {
      const start = (this.currentPage - 1) * this.itemsPerPage;
      const end = start + this.itemsPerPage;
      return this.destinations.slice(start, end);
    },
    totalPages() {
      return Math.ceil(this.destinations.length / this.itemsPerPage);
    }
  },
  methods: {
    ...mapActions(['fetchDestinations', 'addDestination', 'updateDestination', 'deleteDestination']),
    editDestination(destination) {
      this.currentDestination = { ...destination };
      this.showEditForm = true;
      this.showTable = false;
    },
    update() {
      this.updateDestination(this.currentDestination);
      this.showEditForm = false;
      this.showTable = true;
    },
    add() {
      this.addDestination(this.newDestination);
      this.showAddForm = false;
      this.showTable = true;
    },
    openD(id) {
      this.$router.push(`/destination-articles/${id}`);
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
    }
  },
  mounted() {
    this.fetchDestinations();
  }
};
</script>

<style scoped>
.destinations {
  padding: 20px;
}
.destination-table {
  width: 100%;
  border-collapse: collapse;
  margin-top: 20px;
  font-family: Arial, sans-serif;
}
tr:nth-child(even) {
  background-color: #f2f2f2;
}
tr:nth-child(odd) {
  background-color: #ffffff;
}
tr:hover {
  background-color: #e1e1e1;
}
.destination-table th, .destination-table td {
  padding: 15px;
  border: 1px solid #ccc;
}
.destination-table th {
  font-weight: bold;
  background-color: #2c3e50;
  color: #f9f9f9;
}
.destination-table td {
  max-width: 700px;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.name-cell {
  text-align: center;
}
.actions-cell {
  text-align: right;
  width: 100px;
}
button {
  cursor: pointer;
  padding: 10px 15px;
  font-size: 14px;
  margin: 5px;
  border: none;
  border-radius: 4px;
}
.add-button {
  background-color: #5cc910;
  color: white;
}
.action-button {
  padding: 5px 10px;
}
.action-button.edit {
  background-color: #5cc910;
  color: white;
}
.action-button.delete {
  background-color: #dc3545;
  color: white;
}
.form-button {
  background-color: #5cc910;
  color: white;
  margin-top: 10px;
}
.form-button.cancel {
  background-color: #6c757d;
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
  font-weight: bold;
}
form input[type="text"] {
  width: 100%;
  padding: 8px;
  margin-bottom: 30px;
  border: 1px solid #ccc;
  border-radius: 4px;
}
form textarea {
  width: 100%;
  height: 200px;
  padding: 8px;
  margin-bottom: 10px;
  margin-right: 10px;
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
  padding: 10px 15px;
  margin: 0 5px;
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
