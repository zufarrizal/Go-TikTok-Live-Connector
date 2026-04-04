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
  let activeAnimToken = 0;

  function formatNumber(v) {
    return numberFormatter.format(Math.max(0, Math.round(Number(v) || 0)));
  }

  function clampPercent(v) {
    return Math.max(0, Math.min(100, Number(v) || 0));
  }

  function updateFrame(likes, goal, title) {
    const safeGoal = Math.max(1, Number(goal) || 1);
    const safeLikes = Math.max(0, Number(likes) || 0);
    const percent = clampPercent((safeLikes / safeGoal) * 100);

    titleEl.textContent = title || shownTitle;
    valueEl.textContent = formatNumber(safeLikes) + " / " + formatNumber(safeGoal) + " Likes";
    fillEl.style.width = percent.toFixed(2) + "%";
    percentEl.textContent = Math.round(percent) + "%";
  }

  function animateState(nextState, instant) {
    if (!nextState) return;
    const nextTitle = String(nextState.title || "Like Goal").trim() || "Like Goal";
    const nextLikes = Math.max(0, Number(nextState.current_likes || 0));
    const nextGoal = Math.max(1, Number(nextState.current_goal || nextState.goal || 1));
    const prevLikes = shownLikes;
    const prevGoal = shownGoal;

    shownTitle = nextTitle;
    if (instant) {
      shownLikes = nextLikes;
      shownGoal = nextGoal;
      updateFrame(shownLikes, shownGoal, shownTitle);
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

    const duration = 800;
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
      updateFrame(likes, goal, shownTitle);
      if (t < 1) {
        requestAnimationFrame(step);
        return;
      }
      shownLikes = nextLikes;
      shownGoal = nextGoal;
      updateFrame(shownLikes, shownGoal, shownTitle);
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

  loadStateOnce().catch(() => {
  });
})();
