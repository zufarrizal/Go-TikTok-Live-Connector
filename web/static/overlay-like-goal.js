(function () {
  const titleEl = document.getElementById("overlayLikeGoalTitle");
  const valueEl = document.getElementById("overlayLikeGoalValue");
  const fillEl = document.getElementById("overlayLikeGoalFill");
  const percentEl = document.getElementById("overlayLikeGoalPercent");
  const overlayEl = document.querySelector(".like-goal-overlay");
  const numberFormatter = new Intl.NumberFormat("en-US");

  let shownTitle = "Like Goal";
  let shownLikes = 0;
  let shownGoal = 1000;
  let shownBaseGoal = 1000;
  let shownMode = "increase";
  let activeAnimToken = 0;

  function formatNumber(v) {
    return numberFormatter.format(Math.max(0, Math.round(Number(v) || 0)));
  }

  function clampPercent(v) {
    return Math.max(0, Math.min(100, Number(v) || 0));
  }

  function nextThreshold(current, base, mode) {
    const safeBase = Math.max(1, Number(base) || 1);
    const safeCurrent = Math.max(1, Number(current) || 1);
    if (mode === "double") {
      return safeCurrent * 2;
    }
    return safeCurrent + safeBase;
  }

  function findGoalWindow(totalLikes, currentGoal, baseGoal, mode) {
    const safeLikes = Math.max(0, Number(totalLikes) || 0);
    const safeGoal = Math.max(1, Number(currentGoal) || 1);
    const safeBase = Math.max(1, Number(baseGoal) || safeGoal);
    const safeMode = String(mode || "increase").toLowerCase() === "double" ? "double" : "increase";

    let start = 0;
    let end = safeGoal;
    let probe = safeBase;
    let guard = 0;

    while (probe < safeGoal && guard < 100000) {
      start = probe;
      probe = nextThreshold(probe, safeBase, safeMode);
      guard += 1;
    }
    if (probe === safeGoal) {
      end = probe;
    } else if (safeGoal <= safeBase) {
      start = 0;
      end = safeGoal;
    } else {
      start = Math.max(0, safeGoal - safeBase);
      end = safeGoal;
    }

    const segmentLikes = Math.max(0, safeLikes - start);
    const segmentGoal = Math.max(1, end - start);
    return { segmentLikes, segmentGoal };
  }

  function updateFrame(likes, goal, baseGoal, mode, title) {
    const safeGoal = Math.max(1, Number(goal) || 1);
    const safeLikes = Math.max(0, Number(likes) || 0);
    const windowState = findGoalWindow(safeLikes, safeGoal, baseGoal, mode);
    const percent = clampPercent((windowState.segmentLikes / windowState.segmentGoal) * 100);
    const scale = percent / 100;

    titleEl.textContent = title || shownTitle;
    valueEl.textContent = formatNumber(windowState.segmentLikes) + " / " + formatNumber(windowState.segmentGoal) + " Likes";
    fillEl.style.transform = "scaleX(" + scale.toFixed(4) + ")";
    percentEl.textContent = Math.round(percent) + "%";
  }

  function animateState(nextState, instant) {
    if (!nextState) return;
    const nextTitle = String(nextState.title || "Like Goal").trim() || "Like Goal";
    const nextLikes = Math.max(0, Number(nextState.current_likes || 0));
    const nextGoal = Math.max(1, Number(nextState.current_goal || nextState.goal || 1));
    const nextBaseGoal = Math.max(1, Number(nextState.goal || nextGoal || 1));
    const nextMode = String(nextState.mode || "increase").toLowerCase() === "double" ? "double" : "increase";
    const prevLikes = shownLikes;
    const prevGoal = shownGoal;
    const prevBaseGoal = shownBaseGoal;

    shownTitle = nextTitle;
    shownMode = nextMode;
    if (instant) {
      shownLikes = nextLikes;
      shownGoal = nextGoal;
      shownBaseGoal = nextBaseGoal;
      updateFrame(shownLikes, shownGoal, shownBaseGoal, shownMode, shownTitle);
      return;
    }

    if (nextLikes > prevLikes && overlayEl) {
      overlayEl.classList.remove("is-boost");
      void overlayEl.offsetWidth;
      overlayEl.classList.add("is-boost");
      window.setTimeout(() => {
        overlayEl.classList.remove("is-boost");
      }, 700);
    }

    const duration = 700;
    const start = performance.now();
    const token = ++activeAnimToken;

    function easeOutCubic(t) {
      return 1 - Math.pow(1 - t, 3);
    }

    function step(now) {
      if (token !== activeAnimToken) return;
      const t = Math.min(1, (now - start) / duration);
      const e = easeOutCubic(t);
      const likes = prevLikes + (nextLikes - prevLikes) * e;
      const goal = prevGoal + (nextGoal - prevGoal) * e;
      const baseGoal = prevBaseGoal + (nextBaseGoal - prevBaseGoal) * e;
      updateFrame(likes, goal, baseGoal, shownMode, shownTitle);
      if (t < 1) {
        requestAnimationFrame(step);
        return;
      }
      shownLikes = nextLikes;
      shownGoal = nextGoal;
      shownBaseGoal = nextBaseGoal;
      updateFrame(shownLikes, shownGoal, shownBaseGoal, shownMode, shownTitle);
    }

    requestAnimationFrame(step);
  }

  function renderState(state) {
    animateState(state, false);
  }

  async function loadStateOnce() {
    const res = await fetch("/api/like-goal");
    const data = await res.json();
    if (!res.ok) {
      throw new Error(data.error || "failed to load like goal");
    }
    animateState(data.state, true);
  }

  const source = new EventSource("/events");
  source.onmessage = (event) => {
    try {
      const payload = JSON.parse(event.data);
      if (payload.type === "like_goal_state") {
        renderState(payload.state);
      }
    } catch (_) {
    }
  };

  loadStateOnce().catch((err) => {
    console.warn("Failed to load like goal state:", err);
  });
})();
