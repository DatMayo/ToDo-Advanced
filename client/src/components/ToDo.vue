<template>
  <div id="container">
    <div class="row mb-4">
      <div class="col-sm"></div>
      <div class="col-sm-9 text-end">
        <button type="button" class="btn btn-primary me-3">Add ToDo</button>
        <button type="button" class="btn btn-danger" @click="logout">Logout</button>
      </div>
      <div class="col-sm"></div>
    </div>
    <div class="row">
      <div class="col-sm"></div>
      <div class="col-sm-9">
        <table class="table table-striped">
          <tr>
            <th>#</th>
            <th>Terminal-ID</th>
            <th>Branch</th>
            <th>Address</th>
            <th>ZIP</th>
            <th>Town</th>
          </tr>
          <tbody>
            <tr
              v-for="todo in todoList"
              :key="todo.id"
              :class="{ strikeout: todo.isFinished === true }"
              @click="toggleToDo(todo.id)"
            >
              <td>{{ todo.id }}</td>
              <td>{{ todo.terminalId }}</td>
              <td>{{ todo.branch }}</td>
              <td>{{ todo.address }}</td>
              <td>{{ todo.zip }}</td>
              <td>{{ todo.town }}</td>
            </tr>
          </tbody>
        </table>
      </div>
      <div class="col-sm"></div>
    </div>
    <div class="row">
      <div class="col-sm"></div>
      <div class="col-sm-9">
        <div class="form-check form-switch text-start">
          <input class="form-check-input" type="checkbox" id="flexSwitchCheckDefault" v-model="showFinished" />
          <label class="form-check-label" for="flexSwitchCheckDefault">Show finished</label>
        </div>
      </div>
      <div class="col-sm"></div>
    </div>
  </div>
</template>

<script>
export default {
  name: 'ToDo',
  data() {
    return {
      showFinished: false,
      todoList: [],
      todoUpdateTimer: -1
    };
  },
  created() {
    this.updateTodoList();
  },
  methods: {
    clearCredentials() {
      localStorage.id = -1;
      localStorage.token = '';
      this.$parent.token = '';
    },
    logout() {
      localStorage.clear();
      this.$parent.token = '';
    },
    toggleToDo(id) {
      this.axios
        .put(
          `${this.$parent.API_URL}/todo/toggle/${id}`,
          {},
          {
            headers: { token: this.$parent.token }
          }
        )
        .then((res) => {
          clearInterval(this.todoUpdateTimer);
          const item = this.todoList.find((item) => item.id == id);
          if (item) item.isFinished = !item.isFinished;
          this.todoUpdateTimer = setTimeout(this.updateTodoList, 1000);
        })
        .catch((err) => {
          const response = err.response.data;
          if (response.Code === 403) return this.clearCredentials();
        });
    },
    updateTodoList() {
      this.axios
        .get(`${this.$parent.API_URL}/todo/list/${this.showFinished ? 'showfinished' : ''}`, {
          headers: { token: this.$parent.token }
        })
        .then((res) => {
          this.todoList = res.data.Data.ToDos;
          this.todoUpdateTimer = setTimeout(this.updateTodoList, 1000);
        })
        .catch((err) => {
          const response = err.response.data;
          if (response.Code === 403) return this.clearCredentials();

          this.todoUpdateTimer = setTimeout(this.updateTodoList, 1000);
        });
    }
  },
  beforeDestroy() {
    clearInterval(this.todoUpdateTimer);
  }
};
</script>

<style scoped>
table {
  border-collapse: collapse;
}
tr {
  cursor: pointer;
}
tr:first-child {
  cursor: default;
}
tr:hover {
  background-color: rgba(0, 0, 0, 0.1);
}
td {
  position: relative;
  padding: 5px 10px;
}

tr.strikeout td:before {
  content: ' ';
  position: absolute;
  top: 50%;
  left: 0;
  border-bottom: 1px solid #111;
  width: 100%;
}

.row {
  --bs-gutter-x: 0;
}
</style>
