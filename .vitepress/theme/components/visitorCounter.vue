<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const counterLoaded = ref(false);
const scriptLoaded = ref(false);

// 定义事件处理函数，便于卸载时移除
const handleBusuanziLoaded = () => {
  counterLoaded.value = true;
  console.log("[访客统计] Busuanzi 数据已就绪");
};

onMounted(() => {
  console.log("[访客统计] 组件已挂载");

  if (typeof window === "undefined") {
    console.log("[访客统计] 非客户端环境，终止加载");
    return;
  }

  // 检查全局变量，防止重复加载和计数
  if (window.busuanziInitialized) {
    scriptLoaded.value = true;
    counterLoaded.value = true;
    console.log("[访客统计] 不蒜子已初始化，跳过加载");
    return;
  }

  // 加载不蒜子脚本（只加载一次）
  if (!document.getElementById("busuanzi_script")) {
    const script = document.createElement("script");
    script.id = "busuanzi_script";
    script.src =
      "https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js";
    script.async = true;

    script.onload = () => {
      scriptLoaded.value = true;
      window.busuanziInitialized = true; // 标记已初始化
      console.log("[访客统计] 不蒜子脚本加载成功");
    };

    script.onerror = (error) => {
      console.error("[访客统计] 不蒜子脚本加载失败:", error);
      counterLoaded.value = true; // 即使失败也显示UI
    };

    document.head.appendChild(script);
  } else {
    scriptLoaded.value = true;
    console.log("[访客统计] 不蒜子脚本已存在");
  }

  // 监听 Busuanzi 数据就绪事件
  document.addEventListener("BusuanziDOMLoaded", handleBusuanziLoaded);
});

onUnmounted(() => {
  // 清除事件监听，防止内存泄漏
  document.removeEventListener("BusuanziDOMLoaded", handleBusuanziLoaded);
});
</script>

<template>
  <div class="visitor-stats" :class="{ 'stats-loaded': counterLoaded }">
    <span class="visitor-item">
      <span class="visitor-label">总访问量:</span>
      <span id="busuanzi_value_site_pv" class="visitor-value">...</span>
    </span>

    <span class="visitor-item">
      <span class="visitor-label">访客数:</span>
      <span id="busuanzi_value_site_uv" class="visitor-value">...</span>
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
  background-color: rgba(255, 255, 255, 0.1);
  transition: all 0.3s ease;
  position: relative;
  z-index: 10;
  opacity: 1;
}

.stats-loaded {
  background-color: rgba(255, 255, 255, 0.15);
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
