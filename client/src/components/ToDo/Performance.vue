<template>
  <div class="col-sm text-end fw-bold" :class="coloredMs">{{ performance.ms }} ms</div>
</template>

<script>
export default {
  name: 'Performance',
  computed: {
    coloredMs() {
      let textColor = 'text-dark';
      if (this.performance.ms <= 120) textColor = 'text-success';
      else if (this.performance.ms <= 250) textColor = 'text-warning';
      else textColor = 'text-danger';
      return textColor;
    }
  },
  created() {
    this.$parent.$on('setT1', (t1) => {
      this.performance.t1 = t1;
    });
    this.$parent.$on('setT2', (t2) => {
      this.performance.t2 = t2;
      this.performance.ms = Math.round(this.performance.t2 - this.performance.t1);
    });
  },
  data() {
    return {
      performance: {
        t1: 0,
        t2: 0,
        ms: 0
      }
    };
  }
};
</script>

<style scoped></style>
