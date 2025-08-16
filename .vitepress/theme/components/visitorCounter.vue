<script setup>
import { ref, onMounted, onUnmounted } from "vue";

// 控制显示/隐藏计数器
const counterLoaded = ref(false);
const scriptLoaded = ref(false);
let checkBusuanziTimer = null;
let timeoutTimer = null;

onMounted(() => {
  console.log("[访客统计] 组件已挂载");

  // 确保在客户端环境
  if (typeof window === "undefined") {
    console.log("[访客统计] 非客户端环境，终止加载");
    return;
  }

  // 先检查不蒜子脚本是否已加载
  if (!document.getElementById("busuanzi_script")) {
    console.log("[访客统计] 开始加载不蒜子脚本");

    const script = document.createElement("script");
    script.id = "busuanzi_script";
    // 添加自定义参数，解决数据共享问题
    script.src = `https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js?r=${Date.now()}&site=knowledge-world`;
    script.async = true;

    script.onload = () => {
      scriptLoaded.value = true;
      console.log("[访客统计] 不蒜子脚本加载成功");
      checkCounter();
    };

    script.onerror = (error) => {
      console.error("[访客统计] 不蒜子脚本加载失败:", error);
      counterLoaded.value = true; // 即使失败也显示UI
    };

    document.head.appendChild(script);
  } else {
    scriptLoaded.value = true;
    console.log("[访客统计] 不蒜子脚本已存在");
    checkCounter();
  }

  function checkCounter() {
    console.log("[访客统计] 开始检查计数器数据");

    checkBusuanziTimer = setInterval(() => {
      const pvElement = document.getElementById("busuanzi_value_site_pv");

      if (pvElement && pvElement.innerHTML !== "") {
        counterLoaded.value = true;
        console.log("[访客统计] 计数器数据已加载:", pvElement.innerHTML);
        clearInterval(checkBusuanziTimer);
        clearTimeout(timeoutTimer);
      } else if (pvElement) {
        console.log("[访客统计] 计数器元素存在但无数据");
      } else {
        console.log("[访客统计] 计数器元素不存在");
      }
    }, 500);

    // 5秒后无论如何停止检查
    timeoutTimer = setTimeout(() => {
      if (checkBusuanziTimer) clearInterval(checkBusuanziTimer);
      counterLoaded.value = true;
      console.log("[访客统计] 检查超时，强制显示计数器");
    }, 5000);
  }
});

onUnmounted(() => {
  console.log("[访客统计] 组件卸载，清除计时器");
  if (checkBusuanziTimer) clearInterval(checkBusuanziTimer);
  if (timeoutTimer) clearTimeout(timeoutTimer);
});
</script>

<template>
  <div class="visitor-stats" :class="{ 'stats-loaded': counterLoaded }">
    <span id="busuanzi_container_site_pv" class="visitor-item">
      <span class="visitor-label">总访问量:</span>
      <span id="busuanzi_value_site_pv" class="visitor-value">...</span>
    </span>

    <span id="busuanzi_container_site_uv" class="visitor-item">
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
  opacity: 1; /* 改为1，防止闪现 */
  transition: all 0.3s ease;
  position: relative;
  z-index: 10; /* 确保可见 */
}

.stats-loaded {
  opacity: 1;
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
