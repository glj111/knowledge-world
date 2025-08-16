// .vitepress/theme/components/visitorCounter.vue
<script setup>
import { ref, onMounted } from "vue";

// 控制显示/隐藏计数器
const counterLoaded = ref(false);

onMounted(() => {
  // 检查busuanzi对象是否已加载
  const checkBusuanzi = setInterval(() => {
    if (
      typeof document !== "undefined" &&
      document.getElementById("busuanzi_container_site_pv") &&
      document.getElementById("busuanzi_value_site_pv").innerHTML !== ""
    ) {
      counterLoaded.value = true;
      clearInterval(checkBusuanzi);
    }
  }, 500);

  // 3秒后无论如何停止检查
  setTimeout(() => {
    clearInterval(checkBusuanzi);
    counterLoaded.value = true;
  }, 3000);
});
</script>

<template>
  <div v-if="counterLoaded" class="visitor-stats">
    <span id="busuanzi_container_site_pv" class="visitor-item">
      <span class="visitor-label">总访问量:</span>
      <span id="busuanzi_value_site_pv" class="visitor-value"></span>
    </span>

    <span id="busuanzi_container_site_uv" class="visitor-item">
      <span class="visitor-label">访客数:</span>
      <span id="busuanzi_value_site_uv" class="visitor-value"></span>
    </span>
  </div>
</template>

<style scoped>
.visitor-stats {
  display: flex;
  justify-content: center;
  flex-wrap: wrap;
  gap: 2rem;
  font-size: 1rem;
  color: var(--vp-c-text-2);
  margin: 2rem 0;
  padding: 1rem;
  border-radius: 8px;
  background-color: rgba(var(--vp-c-bg-soft), 0.5);
}

.visitor-item {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
}

.visitor-value {
  color: var(--vp-c-brand);
  font-weight: bold;
  font-size: 1.2rem;
}
</style>
