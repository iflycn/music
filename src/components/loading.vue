<template>
  <div>
    <span>
      <svg viewBox="25 25 50 50">
        <circle cx="50" cy="50" r="20" fill="none"></circle>
      </svg>
    </span>
  </div>
</template>

<script>
export default {
  name: "GLoading"
};
</script>

<style lang="less" scoped>
@main-color: #df3436;

@keyframes rotate {
  100% {
    transform: rotate(360deg);
  }
}

div {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: transparent;
  z-index: 9999;
  span {
    position: fixed;
    top: 50%;
    left: 50%;
    width: 42px;
    height: 42px;
    transform: translate(-50%, -50%);
  }
  svg {
    width: 100%;
    height: 100%;
    animation: rotate 2s linear infinite;
  }
  circle {
    stroke: @main-color;
    stroke-width: 2;
    stroke-dasharray: 90, 200;
    stroke-linecap: round;
  }
}
</style>
