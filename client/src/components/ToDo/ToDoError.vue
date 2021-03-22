<template>
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
</template>

<script>
export default {
  name: 'ToDoError',
  created() {
    this.$parent.$on('showTimeout', () => {
      if (this.toastHandle) this.toastHandle.show();
    });
  },
  data() {
    return {
      toast: null,
      toastHandle: null
    };
  },
  mounted() {
    this.toast = document.querySelector('#liveToast');
    this.toastHandle = new bootstrap.Toast(this.toast, { delay: 2500 });
  }
};
</script>

<style scoped></style>
