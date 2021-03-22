<template>
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
</template>

<script>
export default {
  name: 'AddToDo',
  created() {
    this.$parent.$on('showTodoModal', () => {
      if (this.todoModalHandle) this.todoModalHandle.show();
    });
  },
  data() {
    return {
      newTodo: {
        terminalId: '',
        branch: '',
        zip: '',
        town: '',
        address: ' 1',
        errors: []
      },
      todoModal: null,
      todoModalHandle: null
    };
  },
  methods: {
    clearToDoWindow() {
      this.newTodo.terminalId = '';
      this.newTodo.branch = '';
      this.newTodo.zip = '';
      this.newTodo.town = '';
      this.newTodo.address = '';
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
            headers: { token: localStorage.token },
            timeout: 1000
          }
        )
        .then((res) => {
          this.todoModalHandle.hide();
        })
        .catch((err) => {
          const response = err.response.data;
          if (response.Code === 403) return this.$parent.clearCredentials();
          for (const error of err.response.data.Error) this.newTodo.errors.push(error);
        });
    }
  },
  mounted() {
    this.$nextTick(function () {
      const that = this;
      this.todoModal = document.querySelector('#addToDo');
      this.todoModalHandle = new bootstrap.Modal(this.todoModal, { backdrop: 'static' });
      this.todoModal.addEventListener('shown.bs.modal', function () {
        document.querySelector('#terminalId').focus();
      });
      this.todoModal.addEventListener('hidden.bs.modal', function () {
        that.clearToDoWindow();
      });
    });
  }
};
</script>

<style scoped></style>
