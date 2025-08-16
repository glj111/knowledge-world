<script setup>
import { ref, onMounted, onUnmounted } from "vue";

const counterLoaded = ref(false);
const scriptLoaded = ref(false);
const sitePV = ref("...");
const siteUV = ref("...");

// 保存到全局变量 + localStorage
const saveBusuanziData = (pv, uv) => {
  if (!pv || !uv) return;
  window.busuanziCachedPV = pv;
  window.busuanziCachedUV = uv;
  try {
    localStorage.setItem("busuanziPV", pv);
    localStorage.setItem("busuanziUV", uv);
  } catch (e) {
    console.error("[访客统计] localStorage 保存失败:", e);
  }
};

// 从缓存加载
const loadBusuanziData = () => {
  if (window.busuanziCachedPV && window.busuanziCachedUV) {
    sitePV.value = window.busuanziCachedPV;
    siteUV.value = window.busuanziCachedUV;
    return true;
  }
  try {
    const pv = localStorage.getItem("busuanziPV");
    const uv = localStorage.getItem("busuanziUV");
    if (pv && uv) {
      sitePV.value = pv;
      siteUV.value = uv;
      window.busuanziCachedPV = pv;
      window.busuanziCachedUV = uv;
      return true;
    }
  } catch {}
  return false;
};

// 监听 <span> 内容变化
let observer;
const observeStats = () => {
  const pvEl = document.getElementById("busuanzi_value_site_pv");
  const uvEl = document.getElementById("busuanzi_value_site_uv");
  if (!pvEl || !uvEl) return;

  observer = new MutationObserver(() => {
    const pv = pvEl.textContent;
    const uv = uvEl.textContent;
    if (pv && uv && pv !== "..." && uv !== "...") {
      sitePV.value = pv;
      siteUV.value = uv;
      saveBusuanziData(pv, uv);
      counterLoaded.value = true;
    }
  });

  observer.observe(pvEl, { childList: true });
  observer.observe(uvEl, { childList: true });
};

// Busuanzi 数据就绪
const handleBusuanziLoaded = () => {
  counterLoaded.value = true;
  observeStats();
};

onMounted(() => {
  if (typeof window === "undefined") return;

  // 加载缓存
  const dataLoaded = loadBusuanziData();
  if (dataLoaded) counterLoaded.value = true;

  // 避免重复加载
  if (!window.busuanziInitialized) {
    const script = document.createElement("script");
    script.id = "busuanzi_script";
    script.src =
      "https://busuanzi.ibruce.info/busuanzi/2.3/busuanzi.pure.mini.js";
    script.async = true;
    script.onload = () => {
      scriptLoaded.value = true;
      window.busuanziInitialized = true;
      handleBusuanziLoaded();
    };
    script.onerror = () => {
      counterLoaded.value = true;
    };
    document.head.appendChild(script);
  } else {
    scriptLoaded.value = true;
    handleBusuanziLoaded();
  }

  document.addEventListener("BusuanziDOMLoaded", handleBusuanziLoaded);
});

onUnmounted(() => {
  document.removeEventListener("BusuanziDOMLoaded", handleBusuanziLoaded);
  if (observer) observer.disconnect();
});
</script>

<template>
  <div class="visitor-stats" :class="{ 'stats-loaded': counterLoaded }">
    <span class="visitor-item">
      <span class="visitor-label">总访问量:</span>
      <span id="busuanzi_value_site_pv" class="visitor-value">{{
        sitePV
      }}</span>
    </span>

    <span class="visitor-item">
      <span class="visitor-label">访客数:</span>
      <span id="busuanzi_value_site_uv" class="visitor-value">{{
        siteUV
      }}</span>
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
