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
    <div
      id="addToDo"
      class="modal fade"
      data-bs-backdrop="static"
      data-bs-keyboard="false"
      tabindex="-1"
      aria-labelledby="staticBackdropLabel"
      aria-hidden="true"
    >
      <div class="modal-dialog">
        <div class="modal-content">
          <div class="modal-header">
            <h5 class="modal-title" id="staticBackdropLabel">Add new ToDo</h5>
            <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
          </div>
          <div class="modal-body text-start">
            <div class="alert alert-danger text-start" role="alert" v-if="newTodo.errors.length > 0">
              There are some errors:
              <ul>
                <li v-for="error in newTodo.errors" :key="error.id">{{ error.msg }}</li>
              </ul>
            </div>
            <div class="row">
              <div class="col-sm">
                <div class="mb-3">
                  <label for="terminalId" class="form-label">Terminal ID</label>
                  <input
                    type="number"
                    class="form-control"
                    id="terminalId"
                    placeholder="123456"
                    v-model="newTodo.terminalId"
                  />
                </div>
              </div>
              <div class="col-sm ms-2">
                <div class="mb-3">
                  <label for="branch" class="form-label">Branch</label>
                  <input
                    type="text"
                    class="form-control"
                    id="branch"
                    placeholder="Spk. Hameln"
                    v-model="newTodo.branch"
                  />
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-sm-3">
                <div class="mb-3">
                  <label for="zip" class="form-label">ZIP</label>
                  <input type="number" class="form-control" id="zip" placeholder="31785" v-model="newTodo.zip" />
                </div>
              </div>
              <div class="col-sm ms-2">
                <div class="mb-3">
                  <label for="town" class="form-label">Town</label>
                  <input type="text" class="form-control" id="town" placeholder="Hameln" v-model="newTodo.town" />
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-sm">
                <div class="mb-3">
                  <label for="address" class="form-label">Address</label>
                  <input
                    type="text"
                    class="form-control"
                    id="address"
                    placeholder="Bahnhofsplatz 23"
                    v-model="newTodo.address"
                  />
                </div>
              </div>
            </div>
          </div>
          <div class="modal-footer">
            <button type="button" class="btn btn-primary" @click.prevent="createTodo">Save</button>
          </div>
        </div>
      </div>
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
        <div class="row">
          <div class="col-sm">
            <div class="form-check form-switch text-start">
              <input class="form-check-input" type="checkbox" id="flexSwitchCheckDefault" v-model="showFinished" />
              <label class="form-check-label" for="flexSwitchCheckDefault">Show finished</label>
            </div>
          </div>
          <div class="col-sm text-end fw-bold" :class="coloredMs">{{ performance.ms }} ms</div>
        </div>
      </div>
      <div class="col-sm"></div>
    </div>
    <div class="position-fixed bottom-0 end-0 p-3" style="z-index: 5">
      <div id="liveToast" class="toast bg-danger" role="alert" aria-live="assertive" aria-atomic="true">
        <div class="toast-header text-start">
          <strong class="me-auto">WARNING!</strong>
        </div>
        <div class="toast-body text-start text-white">
          Could not reach backend server.<br />I'll try to reconnect until the server is back up!
        </div>
      </div>
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
      todoUpdateTimer: -1,
      todoModal: null,
      todoModalHandle: null,
      toast: null,
      toastHandle: null,
      newTodo: {
        terminalId: '',
        branch: '',
        zip: '',
        town: '',
        address: '',
        errors: []
      },
      performance: {
        t1: 0,
        t2: 0,
        ms: 0
      },
      error: ''
    };
  },
  beforeDestroy() {
    clearInterval(this.todoUpdateTimer);
  },
  created() {
    this.updateTodoList();
  },
  computed: {
    coloredMs() {
      let textColor = 'text-dark';
      if (this.performance.ms <= 120) textColor = 'text-success';
      else if (this.performance.ms <= 250) textColor = 'text-warning';
      else textColor = 'text-danger';
      return textColor;
    }
  },
  methods: {
    backendTimeout() {
      this.toastHandle.show();
      this.todoUpdateTimer = setTimeout(this.updateTodoList, 1000);
      this.todoList = [];
    },
    clearToDoWindow() {
      this.newTodo.terminalId = '';
      this.newTodo.branch = '';
      this.newTodo.zip = '';
      this.newTodo.town = '';
      this.newTodo.address = '';
    },
    clearCredentials() {
      localStorage.id = -1;
      localStorage.token = '';
      this.$parent.token = '';
    },
    createTodo() {
      this.newTodo.errors = [];
      if (this.newTodo.terminalId == '') this.newTodo.errors.push({ msg: 'Missing Terminal-ID' });
      if (this.newTodo.branch == '') this.newTodo.errors.push({ msg: 'Missing Branch' });
      if (this.newTodo.zip == '') this.newTodo.errors.push({ msg: 'Missing ZIP Code' });
      if (this.newTodo.town == '') this.newTodo.errors.push({ msg: 'Missing Town' });
      if (this.newTodo.address == '') this.newTodo.errors.push({ msg: 'Missing Address' });
      if (this.newTodo.errors.length > 0) return;
      this.axios
        .post(
          `${this.$parent.API_URL}/todo/create`,
          {
            terminalId: this.newTodo.terminalId,
            branch: this.newTodo.branch,
            address: this.newTodo.address,
            zip: this.newTodo.zip,
            town: this.newTodo.town
          },
          {
            headers: { token: this.$parent.token },
            timeout: 1000
          }
        )
        .then((res) => {
          this.todoModalHandle.hide();
        })
        .catch((err) => {
          const response = err.response.data;
          if (response.Code === 403) return this.backendTimeout();
          for (const error of err.response.data.Error) this.newTodo.errors.push(error);
        });
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
            headers: { token: this.$parent.token },
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
      this.todoModalHandle.show();
    },
    updateTodoList() {
      this.performance.t1 = performance.now();
      this.axios
        .get(`${this.$parent.API_URL}/todo/list/${this.showFinished ? 'showfinished' : ''}`, {
          headers: { token: this.$parent.token },
          timeout: 1000
        })
        .then((res) => {
          this.todoList = res.data.Data.ToDos;
          this.todoUpdateTimer = setTimeout(this.updateTodoList, 1000);
        })
        .catch((err) => {
          if (err.code === 'ECONNABORTED') return this.backendTimeout();
          const response = err.response.data;
          if (response.Code === 403) return this.clearCredentials();

          this.todoUpdateTimer = setTimeout(this.updateTodoList, 1000);
        })
        .finally(() => {
          this.performance.t2 = performance.now();
          this.performance.ms = Math.round(this.performance.t2 - this.performance.t1);
        });
    }
  },
  mounted() {
    const that = this;
    this.todoModal = document.querySelector('#addToDo');
    this.todoModalHandle = new bootstrap.Modal(this.todoModal, { backdrop: 'static' });
    this.todoModal.addEventListener('shown.bs.modal', function () {
      document.querySelector('#terminalId').focus();
    });
    this.todoModal.addEventListener('hidden.bs.modal', function () {
      that.clearToDoWindow();
    });
    this.toast = document.querySelector('#liveToast');
    this.toastHandle = new bootstrap.Toast(this.toast, { delay: 2500 });
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
