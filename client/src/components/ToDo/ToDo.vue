<template>
  <div id="container">
    <div class="row mb-4">
      <div class="col-sm"></div>
      <div class="col-sm-9 text-end">
        <button type="button" class="btn btn-primary me-3" @click="openModal">Add ToDo</button>
        <button type="button" class="btn btn-danger" @click="logout">Logout</button>
      </div>
      <div class="col-sm"></div>
    </div>
    <AddToDo />
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
              <td>{{ todo.zip.toString().padStart(5, '0') }}</td>
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
        <div class="row">
          <div class="col-sm">
            <div class="form-check form-switch text-start">
              <input class="form-check-input" type="checkbox" id="flexSwitchCheckDefault" v-model="showFinished" />
              <label class="form-check-label" for="flexSwitchCheckDefault">Show finished</label>
            </div>
          </div>
          <Performance />
        </div>
      </div>
      <div class="col-sm"></div>
    </div>
    <ToDoError />
  </div>
</template>

<script>
import AddToDo from './AddToDo';
import Performance from './Performance';
import ToDoError from './ToDoError';
export default {
  name: 'ToDo',
  components: {
    AddToDo,
    Performance,
    ToDoError
  },
  data() {
    return {
      showFinished: false,
      todoList: [],
      todoUpdateTimer: -1,

      error: ''
    };
  },
  beforeDestroy() {
    clearInterval(this.todoUpdateTimer);
  },
  created() {
    this.updateTodoList();
  },
  methods: {
    backendTimeout() {
      this.todoUpdateTimer = setTimeout(this.updateTodoList, 1000);
      this.$emit('showTimeout');
    },
    clearCredentials() {
      localStorage.token = '';
      this.$parent.token = '';
    },
    logout() {
      this.clearCredentials();
    },
    toggleToDo(id) {
      this.axios
        .put(
          `${this.API_URL}/todo/toggle/${id}`,
          {},
          {
            headers: { token: localStorage.token },
            timeout: 1000
          }
        )
        .then((res) => {
          clearInterval(this.todoUpdateTimer);
          const item = this.todoList.find((item) => item.id == id);
          if (item) item.isFinished = !item.isFinished;
          this.todoUpdateTimer = setTimeout(this.updateTodoList, 1000);
        })
        .catch((err) => {
          if (err.code === 'ECONNABORTED') return this.backendTimeout();
          const response = err.response.data;
          if (response.Code === 403) return this.clearCredentials();
        });
    },
    openModal() {
      this.shwoModal = true;
      this.$emit('showTodoModal');
    },
    updateTodoList() {
      this.$emit('setT1', performance.now());
      this.axios
        .get(`${this.API_URL}/todo/list/${this.showFinished ? 'showfinished' : ''}`, {
          headers: { token: localStorage.token },
          timeout: 1000
        })
        .then((res) => {
          this.todoList = res.data.Data.ToDos;
          this.todoUpdateTimer = setTimeout(this.updateTodoList, 1000);
        })
        .catch((err) => {
          if (err.code === 'ECONNABORTED') return this.backendTimeout();
          if (!err.response) return this.backendTimeout();
          const response = err.response.data;
          if (response.Code === 403) return this.clearCredentials();

          this.todoUpdateTimer = setTimeout(this.updateTodoList, 1000);
        })
        .finally(() => {
          this.$emit('setT2', performance.now());
        });
    }
  },
  props: ['API_URL']
};
</script>

<style scoped>
table {
  border-collapse: collapse;
}
tr {
  cursor: pointer;
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
ul {
  margin-bottom: 0;
}
.row {
  --bs-gutter-x: 0;
}
</style>
