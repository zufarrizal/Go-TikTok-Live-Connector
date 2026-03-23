const statusEl = document.getElementById("status");
    const eventsEl = document.getElementById("events");
    const usernameEl = document.getElementById("username");
    const connectBtn = document.getElementById("connectBtn");
    const stopBtn = document.getElementById("stopBtn");
    const mcStatusEl = document.getElementById("mcStatus");
    const mcHostEl = document.getElementById("mcHost");
    const mcPortEl = document.getElementById("mcPort");
    const mcPasswordEl = document.getElementById("mcPassword");
    const mcConnectBtn = document.getElementById("mcConnectBtn");
    const mcDisconnectBtn = document.getElementById("mcDisconnectBtn");
    const mcCommandEl = document.getElementById("mcCommand");
    const mcSendBtn = document.getElementById("mcSendBtn");
    const testEventTypeEl = document.getElementById("testEventType");
    const testEventUsernameEl = document.getElementById("testEventUsername");
    const testEventGiftEl = document.getElementById("testEventGift");
    const testEventGiftPickerHostEl = document.getElementById("testEventGiftPicker");
    const testEventCountEl = document.getElementById("testEventCount");
    const testEventTextEl = document.getElementById("testEventText");
    const testEventBtn = document.getElementById("testEventBtn");
    const mcOutputEl = document.getElementById("mcOutput");
    const eventModalEl = document.getElementById("eventModal");
    const openEventModalBtn = document.getElementById("openEventModalBtn");
    const closeEventModalBtn = document.getElementById("closeEventModalBtn");
    const eventModalTitleEl = document.getElementById("eventModalTitle");
    const eventForm = document.getElementById("eventForm");
    const eventTypeEl = document.getElementById("eventType");
    const eventLabelEl = document.getElementById("eventLabel");
    const eventGiftEl = document.getElementById("eventGift");
    const eventGiftPickerHostEl = document.getElementById("eventGiftPicker");
    const eventSoundEl = document.getElementById("eventSound");
    const pickEventSoundBtn = document.getElementById("pickEventSoundBtn");
    const eventSoundFileEl = document.getElementById("eventSoundFile");
    const eventMCCommandEl = document.getElementById("eventMCCommand");
    const resetEventBtn = document.getElementById("resetEventBtn");
    const eventRowsEl = document.getElementById("eventRows");
    let editingEventId = null;
    let giftOptions = [];
    const MAX_EVENT_HISTORY = 10;

    function setStatus(text, isOK) {
      statusEl.textContent = text;
      if (isOK) statusEl.classList.add("ok");
      else statusEl.classList.remove("ok");
    }

    function addEvent(payload) {
      const item = document.createElement("li");
      const view = formatHistoryItem(payload);
      const eventTime = formatEventTime(payload && payload.time ? payload.time : "");
      item.innerHTML = view.html + "<span class=\"ev-time\">" + esc(eventTime) + "</span>";
      eventsEl.prepend(item);
      if (eventsEl.children.length > MAX_EVENT_HISTORY) {
        eventsEl.removeChild(eventsEl.lastChild);
      }
    }

    function formatEventTime(v) {
      if (!v) return "--:--:--";
      const d = new Date(v);
      if (Number.isNaN(d.getTime())) return String(v);
      return d.toLocaleTimeString();
    }

    function esc(v) {
      return String(v || "")
        .replaceAll("&", "&amp;")
        .replaceAll("<", "&lt;")
        .replaceAll(">", "&gt;")
        .replaceAll("\"", "&quot;")
        .replaceAll("'", "&#39;");
    }

    function normalizeSoundURL(v) {
      const raw = String(v || "").trim();
      if (!raw) return "";
      if (/^(https?:)?\/\//i.test(raw) || raw.startsWith("/") || raw.startsWith("./") || raw.startsWith("../")) {
        return raw;
      }
      return "/static/" + raw.replace(/^static\//i, "");
    }

    function buildStaticSoundPath(fileName) {
      const name = String(fileName || "").split(/[\\/]/).pop().trim();
      if (!name) return "";
      return "/static/sounds/" + name.replace(/\s+/g, " ");
    }

    function getSoundFileName(soundURL) {
      const raw = String(soundURL || "").trim();
      if (!raw) return "";
      const clean = raw.split("?")[0].split("#")[0];
      const parts = clean.split("/");
      return parts[parts.length - 1] || clean;
    }

    async function uploadSoundFile(file) {
      const formData = new FormData();
      formData.append("file", file);
      const res = await fetch("/api/upload/sound", {
        method: "POST",
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "failed to upload sound");
      return data;
    }

    function resolveGiftImageSrc(gift) {
      if (!gift) return "";
      const imagePath = String(gift.image_path || "").trim();
      if (imagePath) {
        return "/" + imagePath.replace(/^[/\\]+/, "").replaceAll("\\", "/");
      }
      return String(gift.image_url || "").trim();
    }

    function createGiftThumb(src, alt) {
      if (!src) {
        const fallback = document.createElement("span");
        fallback.className = "gift-picker-thumb-placeholder";
        fallback.textContent = "IMG";
        return fallback;
      }
      const img = document.createElement("img");
      img.className = "gift-picker-thumb";
      img.src = src;
      img.alt = alt;
      img.loading = "lazy";
      img.addEventListener("error", () => {
        img.replaceWith(createGiftThumb("", alt));
      }, { once: true });
      return img;
    }

    function fillGiftSelect(selectEl, items) {
      selectEl.innerHTML = "<option value=\"\">Select Gift</option>";
      for (const g of items) {
        const opt = document.createElement("option");
        opt.value = String(g.id);
        opt.textContent = g.nama_gift + " (" + g.diamond + ")";
        selectEl.appendChild(opt);
      }
    }

    function createGiftPicker(selectEl, hostEl, placeholder) {
      const root = document.createElement("div");
      root.className = "gift-picker";

      const toggle = document.createElement("button");
      toggle.type = "button";
      toggle.className = "gift-picker-toggle";
      toggle.setAttribute("aria-haspopup", "listbox");
      toggle.setAttribute("aria-expanded", "false");

      const selectedWrap = document.createElement("span");
      selectedWrap.className = "gift-picker-selected";

      const menu = document.createElement("div");
      menu.className = "gift-picker-menu";
      menu.hidden = true;

      const search = document.createElement("input");
      search.type = "search";
      search.className = "gift-picker-search";
      search.placeholder = "Cari gift...";

      const list = document.createElement("div");
      list.className = "gift-picker-list";
      list.setAttribute("role", "listbox");

      menu.appendChild(search);
      menu.appendChild(list);
      toggle.appendChild(selectedWrap);
      root.appendChild(toggle);
      root.appendChild(menu);
      hostEl.appendChild(root);

      let options = [];

      function renderSelected() {
        selectedWrap.innerHTML = "";
        const selected = options.find((g) => String(g.id) === String(selectEl.value || ""));
        if (!selected) {
          const copy = document.createElement("span");
          copy.className = "gift-picker-copy";
          copy.innerHTML = "<span class=\"gift-picker-name\">" + esc(placeholder) + "</span>";
          selectedWrap.appendChild(createGiftThumb("", ""));
          selectedWrap.appendChild(copy);
          return;
        }

        const copy = document.createElement("span");
        copy.className = "gift-picker-copy";
        copy.innerHTML = "<span class=\"gift-picker-name\">" + esc(selected.nama_gift) + "</span>";
        selectedWrap.appendChild(createGiftThumb(resolveGiftImageSrc(selected), selected.nama_gift || "Gift"));
        selectedWrap.appendChild(copy);
      }

      function renderList() {
        const query = String(search.value || "").trim().toLowerCase();
        list.innerHTML = "";
        const filtered = options.filter((g) => {
          if (!query) return true;
          return String(g.nama_gift || "").toLowerCase().includes(query) ||
            String(g.diamond || "").includes(query) ||
            String(g.id || "").includes(query);
        });

        if (filtered.length === 0) {
          const empty = document.createElement("div");
          empty.className = "gift-picker-empty";
          empty.textContent = "Gift tidak ditemukan.";
          list.appendChild(empty);
          return;
        }

        for (const g of filtered) {
          const option = document.createElement("button");
          option.type = "button";
          option.className = "gift-picker-option";
          if (String(g.id) === String(selectEl.value || "")) {
            option.classList.add("is-selected");
          }

          const copy = document.createElement("span");
          copy.className = "gift-picker-option-copy";
          copy.innerHTML = "<span class=\"gift-picker-name\">" + esc(g.nama_gift) + "</span><span class=\"gift-picker-meta\">" + esc(g.diamond) + " diamonds - ID " + esc(g.id) + "</span>";
          option.appendChild(createGiftThumb(resolveGiftImageSrc(g), g.nama_gift || "Gift"));
          option.appendChild(copy);
          option.addEventListener("click", () => {
            selectEl.value = String(g.id);
            renderSelected();
            renderList();
            closeMenu();
            selectEl.dispatchEvent(new Event("change", { bubbles: true }));
          });
          list.appendChild(option);
        }
      }

      function openMenu() {
        if (toggle.disabled) return;
        menu.hidden = false;
        toggle.setAttribute("aria-expanded", "true");
        renderList();
        search.focus();
      }

      function closeMenu() {
        menu.hidden = true;
        toggle.setAttribute("aria-expanded", "false");
      }

      toggle.addEventListener("click", () => {
        if (menu.hidden) {
          openMenu();
          return;
        }
        closeMenu();
      });

      search.addEventListener("input", renderList);
      selectEl.addEventListener("change", () => {
        renderSelected();
        renderList();
      });

      document.addEventListener("click", (event) => {
        if (!root.contains(event.target)) {
          closeMenu();
        }
      });

      root.addEventListener("keydown", (event) => {
        if (event.key === "Escape") {
          closeMenu();
          toggle.focus();
        }
      });

      renderSelected();

      return {
        setOptions(items) {
          options = Array.isArray(items) ? items : [];
          search.value = "";
          renderSelected();
          renderList();
        },
        setDisabled(disabled) {
          toggle.disabled = !!disabled;
          search.disabled = !!disabled;
          root.classList.toggle("disabled", !!disabled);
          if (disabled) closeMenu();
        },
        syncFromSelect() {
          renderSelected();
          renderList();
        }
      };
    }

    const eventGiftPicker = createGiftPicker(eventGiftEl, eventGiftPickerHostEl, "Select Gift");
    const testEventGiftPicker = createGiftPicker(testEventGiftEl, testEventGiftPickerHostEl, "Select Gift");

    function playTriggerSound(soundURL) {
      const url = normalizeSoundURL(soundURL);
      if (!url) return;
      const audio = new Audio(url);
      audio.preload = "auto";
      audio.play().catch(() => {
      });
    }

    function getUsername(payload) {
      const d = payload && payload.data ? payload.data : {};
      const u = d.user || d.User || {};
      return u.username || u.Username || "Unknown";
    }

    function getFollowState(payload) {
      const d = payload && payload.data ? payload.data : {};
      const uid = d.userIdentity || d.UserIdentity || {};
      if (typeof uid.isFollower === "boolean") return uid.isFollower;
      if (typeof uid.IsFollower === "boolean") return uid.IsFollower;
      if (typeof uid.isFollowerOfAnchor === "boolean") return uid.isFollowerOfAnchor;
      if (typeof uid.IsFollowerOfAnchor === "boolean") return uid.IsFollowerOfAnchor;

      const u = d.user || d.User || {};
      const extra = u.extraAttributes || u.ExtraAttributes || {};
      const role = extra.followRole ?? extra.FollowRole;
      if (typeof role === "number") return role > 0;
      if (typeof role === "string" && role.trim() !== "" && !Number.isNaN(Number(role))) {
        return Number(role) > 0;
      }
      return null;
    }

    function followBadgeHTML(state) {
      if (state === true) return "<span class=\"ev-badge follow\">FOLLOW</span>";
      if (state === false) return "<span class=\"ev-badge nofollow\">NOT FOLLOWING</span>";
      return "";
    }

    function formatHistoryItem(payload) {
      if (!payload) {
        return { html: "<span class=\"ev-badge system\">SYSTEM</span><span class=\"ev-text\">Empty event</span>" };
      }

      if (payload.type === "error") {
        return {
          html: "<span class=\"ev-badge error\">ERROR</span><span class=\"ev-text\">" + esc(payload.error || "unknown error") + "</span>"
        };
      }

      if (payload.type === "status") {
        return {
          html: "<span class=\"ev-badge system\">SYSTEM</span><span class=\"ev-text\">" + esc(payload.message || "") + "</span>"
        };
      }

      if (payload.type === "trigger") {
        const eventType = String(payload.event_type || "").toLowerCase();
        const username = payload.username || "Unknown";
        const ruleId = payload.event_id ?? "?";
        const giftName = payload.gift_name || "Gift";
        const repeatCount = Math.max(1, Number(payload.repeat_count || 1));
        let detail = "event #" + esc(ruleId);

        if (eventType === "gift") {
          detail = "gift trigger " + esc(giftName) + " x" + esc(repeatCount) + " -> event #" + esc(ruleId);
        } else if (eventType) {
          detail = esc(eventType) + " trigger -> event #" + esc(ruleId);
        }

        return {
          html: "<span class=\"ev-user\">" + esc(username) + "</span><span class=\"ev-badge system\">TRIGGER</span><span class=\"ev-text\">" + detail + "</span>"
        };
      }

      if (payload.type === "event") {
        const data = payload.data || {};
        const eventType = String(payload.eventType || "");
        const username = getUsername(payload);
        const followBadge = followBadgeHTML(getFollowState(payload));

        if (eventType.includes("UserEvent")) {
          const tag = String(data.event || data.Event || "").toUpperCase();
          if (tag.includes("JOIN")) {
            return {
              html: "<span class=\"ev-user\">" + esc(username) + "</span><span class=\"ev-badge join\">JOIN LIVE</span>" + followBadge
            };
          }
          if (tag.includes("FOLLOW")) {
            return {
              html: "<span class=\"ev-user\">" + esc(username) + "</span><span class=\"ev-badge follow\">FOLLOW</span>" + followBadge
            };
          }
          if (tag.includes("SHARE")) {
            return {
              html: "<span class=\"ev-user\">" + esc(username) + "</span><span class=\"ev-badge share\">SHARE LIVE</span>" + followBadge
            };
          }
          return {
            html: "<span class=\"ev-user\">" + esc(username) + "</span><span class=\"ev-badge system\">" + esc(tag || "USER EVENT") + "</span>" + followBadge
          };
        }

        if (eventType.includes("ChatEvent")) {
          const comment = data.comment || data.Comment || "";
          return {
            html: "<span class=\"ev-user\">" + esc(username) + "</span><span class=\"ev-badge comment\">COMMENT</span>" + followBadge + "<span class=\"ev-text\">" + esc(comment) + "</span>"
          };
        }

        if (eventType.includes("LikeEvent")) {
          const likes = data.likes ?? data.Likes ?? 0;
          return {
            html: "<span class=\"ev-user\">" + esc(username) + "</span><span class=\"ev-badge like\">LIKE</span>" + followBadge + "<span class=\"ev-meta\">" + esc(likes) + " likes</span>"
          };
        }

        if (eventType.includes("GiftEvent")) {
          const giftName = data.name || data.Name || "Gift";
          const diamond = data.diamonds ?? data.Diamonds ?? 0;
          const repeatCount = Math.max(1, Number(data.repeatCount ?? data.RepeatCount ?? 1));
          const totalDiamonds = Number(diamond) * repeatCount;
          return {
            html: "<span class=\"ev-user\">" + esc(username) + "</span><span class=\"ev-badge gift\">GIFT</span>" + followBadge + "<span class=\"ev-text\">" + esc(giftName) + "</span><span class=\"ev-meta\">x" + esc(repeatCount) + " | " + esc(diamond) + " diamonds each | total " + esc(totalDiamonds) + "</span>"
          };
        }

        if (eventType.includes("RoomEvent")) {
          const msg = data.message || data.Message || "";
          return {
            html: "<span class=\"ev-badge room\">ROOM EVENT</span><span class=\"ev-text\">" + esc(msg) + "</span>"
          };
        }

        if (eventType.includes("ViewersEvent")) {
          const viewers = data.viewers ?? data.Viewers ?? 0;
          return {
            html: "<span class=\"ev-badge viewers\">VIEWERS</span><span class=\"ev-meta\">" + esc(viewers) + " watching</span>"
          };
        }

        if (eventType.includes("QuestionEvent")) {
          const q = data.quesion || data.Quesion || data.question || "";
          return {
            html: "<span class=\"ev-user\">" + esc(username) + "</span><span class=\"ev-badge question\">QUESTION</span>" + followBadge + "<span class=\"ev-text\">" + esc(q) + "</span>"
          };
        }

        if (eventType.includes("ControlEvent")) {
          const desc = data.description || data.Description || "";
          return {
            html: "<span class=\"ev-badge control\">CONTROL</span><span class=\"ev-text\">" + esc(desc) + "</span>"
          };
        }

        if (eventType.includes("MicBattleEvent")) {
          const count = (data.users || data.Users || []).length || 0;
          return {
            html: "<span class=\"ev-badge battle\">MIC BATTLE</span><span class=\"ev-meta\">" + esc(count) + " users</span>"
          };
        }

        if (eventType.includes("BattlesEvent")) {
          const count = (data.battles || data.Battles || []).length || 0;
          const status = data.status ?? data.Status ?? "";
          return {
            html: "<span class=\"ev-badge battle\">BATTLES</span><span class=\"ev-meta\">status=" + esc(status) + " total=" + esc(count) + "</span>"
          };
        }

        if (eventType.includes("RoomBannerEvent")) {
          return {
            html: "<span class=\"ev-badge banner\">ROOM BANNER</span><span class=\"ev-text\">Banner update</span>"
          };
        }

        if (eventType.includes("IntroEvent")) {
          const title = data.title || data.Title || "";
          const host = (data.user && (data.user.username || data.user.Username)) || "";
          return {
            html: "<span class=\"ev-badge intro\">INTRO</span><span class=\"ev-user\">" + esc(host) + "</span><span class=\"ev-text\">" + esc(title) + "</span>"
          };
        }
      }

      return {
        html: "<span class=\"ev-badge system\">EVENT</span><span class=\"ev-text\">" + esc(payload.type || "unknown") + "</span>"
      };
    }

    function setMCOutput(text) {
      mcOutputEl.textContent = text || "";
    }

    function setMCStatus(s) {
      const status = s && s.connected ? "connected" : "disconnected";
      const enabled = s && s.enabled ? "enabled" : "disabled";
      const host = (s && s.host ? s.host : "127.0.0.1") + ":" + (s && s.port ? s.port : 25575);
      const msg = "rcon=" + status + " | server.properties enable-rcon=" + enabled + " | target=" + host + (s && s.last_error ? " | error=" + s.last_error : "");
      mcStatusEl.textContent = msg;
    }

    async function refreshMCStatus() {
      try {
        const res = await fetch("/api/minecraft/rcon/status");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "failed to check RCON status");
        setMCStatus(data);
        if (data.host) mcHostEl.value = data.host;
        if (data.port) mcPortEl.value = String(data.port);
      } catch (err) {
        mcStatusEl.textContent = err.message || "failed to check RCON status";
      }
    }

    function resetEventForm() {
      editingEventId = null;
      eventForm.reset();
      eventTypeEl.value = "join";
      eventSoundEl.value = "";
      eventModalTitleEl.textContent = "Add Event";
      syncGiftFields();
      syncLabelHint();
      eventTypeEl.focus();
    }

    function openEventModal(isEdit) {
      eventModalTitleEl.textContent = isEdit ? "Edit Event" : "Add Event";
      eventModalEl.classList.add("show");
      eventModalEl.setAttribute("aria-hidden", "false");
    }

    function closeEventModal() {
      eventModalEl.classList.remove("show");
      eventModalEl.setAttribute("aria-hidden", "true");
    }

    function syncGiftFields() {
      const isGift = eventTypeEl.value === "gift";
      eventGiftEl.disabled = !isGift;
      eventGiftPicker.setDisabled(!isGift);
      if (!isGift) {
        eventGiftEl.value = "";
        eventGiftPicker.syncFromSelect();
        return;
      }
      if (!eventGiftEl.value && giftOptions.length > 0) {
        eventGiftEl.value = String(giftOptions[0].id);
      }
      eventGiftPicker.syncFromSelect();
    }

    function syncLabelHint() {
      const t = eventTypeEl.value;
      if (t === "like") {
        eventLabelEl.placeholder = "Like count (number, e.g. 10)";
        return;
      }
      if (t === "comment") {
        eventLabelEl.placeholder = "Comment text to match (e.g. hello)";
        return;
      }
      if (t === "gift") {
        eventLabelEl.placeholder = "Optional label (e.g. gift trigger)";
        return;
      }
      eventLabelEl.placeholder = "Event label (optional)";
    }

    async function loadGiftOptions() {
      try {
        const res = await fetch("/api/gifts");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "failed to load gift-list.json");
        giftOptions = data.items || [];
        fillGiftSelect(eventGiftEl, giftOptions);
        fillGiftSelect(testEventGiftEl, giftOptions);
        eventGiftPicker.setOptions(giftOptions);
        testEventGiftPicker.setOptions(giftOptions);
        syncGiftFields();
        syncLabelHint();
        syncTestEventFields();
      } catch (err) {
        setStatus(err.message || "failed to load gift-list.json", false);
      }
    }

    function renderEventRows(items) {
      eventRowsEl.innerHTML = "";
      if (!items || items.length === 0) {
        const tr = document.createElement("tr");
        tr.innerHTML = "<td colspan=\"7\">No events yet.</td>";
        eventRowsEl.appendChild(tr);
        return;
      }

      const sortedItems = [...items].sort((a, b) => {
        const aEmpty = a.diamond === null || a.diamond === undefined || String(a.diamond).trim() === "";
        const bEmpty = b.diamond === null || b.diamond === undefined || String(b.diamond).trim() === "";
        if (aEmpty !== bEmpty) return aEmpty ? -1 : 1;

        const aDiamond = Number(a.diamond);
        const bDiamond = Number(b.diamond);
        const aValid = Number.isFinite(aDiamond);
        const bValid = Number.isFinite(bDiamond);
        if (aValid && bValid && aDiamond !== bDiamond) return aDiamond - bDiamond;
        if (aValid !== bValid) return aValid ? 1 : -1;

        return Number(b.id || 0) - Number(a.id || 0);
      });

      for (const item of sortedItems) {
        const tr = document.createElement("tr");
        tr.innerHTML =
          "<td>" + (item.type || "") + "</td>" +
          "<td>" + (item.label || "") + "</td>" +
          "<td>" + (item.gift_name || "") + "</td>" +
          "<td>" + (item.diamond ?? 0) + "</td>" +
          "<td>" + esc(getSoundFileName(item.sound_url)) + "</td>" +
          "<td>" + (item.mc_command || "") + "</td>" +
          "<td>" +
			"<button type=\"button\" class=\"run\" data-act=\"test\" data-id=\"" + item.id + "\">Run</button>" +
			"<button type=\"button\" class=\"edit\" data-act=\"edit\" data-id=\"" + item.id + "\">Edit</button>" +
          "<button type=\"button\" class=\"delete\" data-act=\"delete\" data-id=\"" + item.id + "\">Delete</button>" +
			"</td>";
		eventRowsEl.appendChild(tr);
	}
    }

    async function loadEventsTable() {
      try {
        const res = await fetch("/api/events");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "failed to load events");
        renderEventRows(data.items || []);
      } catch (err) {
        setStatus(err.message || "failed to load events", false);
      }
    }

    async function refreshState() {
      try {
        const res = await fetch("/state");
        const state = await res.json();
        if (state.running) {
          usernameEl.value = state.username || "";
          setStatus("tracking @" + (state.username || "-"), true);
        } else {
          setStatus("idle (not connected)", false);
        }
      } catch (_) {
        setStatus("failed to fetch state", false);
      }
    }

    connectBtn.addEventListener("click", async () => {
      const username = usernameEl.value.trim();
      if (!username) {
        setStatus("username is required", false);
        return;
      }
      try {
        const res = await fetch("/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "start failed");
        setStatus("starting @" + username + "...", true);
      } catch (err) {
        setStatus(err.message || "start failed", false);
      }
    });

    stopBtn.addEventListener("click", async () => {
      try {
        const res = await fetch("/stop", { method: "POST" });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "stop failed");
        setStatus("stopped", false);
      } catch (err) {
        setStatus(err.message || "stop failed", false);
      }
    });

    usernameEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter") connectBtn.click();
    });

    mcConnectBtn.addEventListener("click", async () => {
      const payload = {
        host: mcHostEl.value.trim(),
        port: Number(mcPortEl.value || 0),
        password: mcPasswordEl.value
      };
      try {
        const res = await fetch("/api/minecraft/rcon/connect", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "failed to connect RCON");
        setMCOutput("RCON connected.");
        await refreshMCStatus();
      } catch (err) {
        setMCOutput(err.message || "failed to connect RCON");
        await refreshMCStatus();
      }
    });

    mcDisconnectBtn.addEventListener("click", async () => {
      try {
        const res = await fetch("/api/minecraft/rcon/disconnect", { method: "POST" });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "failed to disconnect RCON");
        setMCOutput("RCON disconnected.");
        await refreshMCStatus();
      } catch (err) {
        setMCOutput(err.message || "failed to disconnect RCON");
      }
    });

    mcSendBtn.addEventListener("click", async () => {
      const command = mcCommandEl.value.trim();
      if (!command) {
        setMCOutput("Command is empty.");
        return;
      }
      try {
        const res = await fetch("/api/minecraft/rcon/command", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ command })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "failed to send command");
        setMCOutput(data.output || "(no output)");
        await refreshMCStatus();
      } catch (err) {
        setMCOutput(err.message || "failed to send command");
      }
    });

    mcCommandEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter") mcSendBtn.click();
    });

    function syncTestEventFields() {
      const isGift = testEventTypeEl.value === "gift";
      testEventGiftEl.disabled = !isGift;
      testEventGiftPicker.setDisabled(!isGift);
      if (!isGift) {
        testEventGiftEl.value = "";
        testEventGiftPicker.syncFromSelect();
      } else if (!testEventGiftEl.value && giftOptions.length > 0) {
        testEventGiftEl.value = String(giftOptions[0].id);
      }
      testEventGiftPicker.syncFromSelect();
    }

    testEventTypeEl.addEventListener("change", syncTestEventFields);

    testEventBtn.addEventListener("click", async () => {
      const type = testEventTypeEl.value;
      const username = (testEventUsernameEl.value || "").trim() || "TestPlayer";
      const giftId = Number(testEventGiftEl.value || 0);
      const repeatCount = Math.max(1, Number(testEventCountEl.value || 1));
      const text = (testEventTextEl.value || "").trim();

      if (type === "gift" && !giftId) {
        setStatus("select a gift for simulation", false);
        return;
      }
      try {
        const res = await fetch("/api/test/event", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type,
            username,
            gift_id: giftId,
            repeat_count: repeatCount,
            text
          })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "failed to simulate event");
        setStatus("event simulated: " + (data.type || type) + " @" + username, true);
        setMCOutput("Simulated " + (data.type || type) + " - " + (data.message || data.gift_name || "ok"));
      } catch (err) {
        setStatus(err.message || "failed to simulate event", false);
        setMCOutput(err.message || "failed to simulate event");
      }
    });

    eventForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const type = eventTypeEl.value;
      const giftId = Number(eventGiftEl.value || 0);
      const gift = giftOptions.find((g) => g.id === giftId);
      const payload = {
        type: type,
        label: eventLabelEl.value.trim(),
        gift_id: type === "gift" ? giftId : 0,
        sound_url: normalizeSoundURL(eventSoundEl.value.trim()),
        mc_command: eventMCCommandEl.value.trim()
      };
      if (!payload.type) {
        setStatus("event type is required", false);
        return;
      }
      if (!payload.mc_command) {
        setStatus("minecraft command is required", false);
        return;
      }
      if (type === "gift" && (!gift || giftId <= 0)) {
        setStatus("select a gift from gift-list.json", false);
        return;
      }

      try {
        const isUpdate = editingEventId !== null;
        const url = isUpdate ? "/api/events/" + editingEventId : "/api/events";
        const method = isUpdate ? "PUT" : "POST";
        const res = await fetch(url, {
          method,
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "failed to save");
        setStatus(isUpdate ? "event updated successfully" : "event created successfully", true);
        resetEventForm();
        closeEventModal();
        await loadEventsTable();
      } catch (err) {
        setStatus(err.message || "failed to save event", false);
      }
    });

    resetEventBtn.addEventListener("click", () => {
      resetEventForm();
    });

    openEventModalBtn.addEventListener("click", () => {
      resetEventForm();
      openEventModal(false);
    });

    closeEventModalBtn.addEventListener("click", () => {
      closeEventModal();
    });

    eventModalEl.addEventListener("click", (e) => {
      if (e.target === eventModalEl) {
        closeEventModal();
      }
    });

    eventRowsEl.addEventListener("click", async (e) => {
      const btn = e.target.closest("button");
      if (!btn) return;
      const id = Number(btn.dataset.id);
      const action = btn.dataset.act;
      if (!id || !action) return;

		if (action === "edit") {
        try {
          const res = await fetch("/api/events");
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "failed to load");
          const item = (data.items || []).find((x) => Number(x.id) === id);
          if (!item) throw new Error("event not found");
          editingEventId = id;
          eventTypeEl.value = item.type || "join";
          eventLabelEl.value = item.label || "";
          if (item.type === "gift" && item.gift_id) {
            eventGiftEl.value = String(item.gift_id);
          } else {
            eventGiftEl.value = "";
          }
          syncGiftFields();
          syncLabelHint();
          eventSoundEl.value = item.sound_url || "";
          eventMCCommandEl.value = item.mc_command || "";
          eventTypeEl.focus();
          openEventModal(true);
          setStatus("editing event #" + id, true);
        } catch (err) {
          setStatus(err.message || "failed to edit event", false);
        }
			return;
		}

		if (action === "test") {
			try {
				const res = await fetch("/api/events/test/" + id, { method: "POST" });
				const data = await res.json();
				if (!res.ok) throw new Error(data.error || "failed to test command");
				setStatus("event test #" + id + " succeeded", true);
				setMCOutput(data.output || "(no output)");
				await refreshMCStatus();
			} catch (err) {
				setStatus(err.message || "failed to test event", false);
				setMCOutput(err.message || "failed to test event");
			}
			return;
		}

		if (action === "delete") {
        if (!confirm("Delete event #" + id + "?")) return;
        try {
          const res = await fetch("/api/events/" + id, { method: "DELETE" });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || "failed to delete");
          if (editingEventId === id) resetEventForm();
          setStatus("event deleted successfully", true);
          await loadEventsTable();
        } catch (err) {
          setStatus(err.message || "failed to delete event", false);
        }
      }
    });

    eventTypeEl.addEventListener("change", () => {
      syncGiftFields();
      syncLabelHint();
    });
    eventGiftEl.addEventListener("change", syncGiftFields);
    eventSoundFileEl.addEventListener("change", async () => {
      const file = eventSoundFileEl.files && eventSoundFileEl.files[0];
      if (!file) return;
      const fallbackPath = buildStaticSoundPath(file.name);
      const originalLabel = pickEventSoundBtn.textContent;
      pickEventSoundBtn.setAttribute("aria-disabled", "true");
      pickEventSoundBtn.textContent = "Uploading...";
      try {
        const data = await uploadSoundFile(file);
        eventSoundEl.value = data.sound_url || fallbackPath;
        setStatus("Sound uploaded successfully.", true);
      } catch (err) {
        setStatus(err.message || "failed to upload sound", false);
      } finally {
        pickEventSoundBtn.removeAttribute("aria-disabled");
        pickEventSoundBtn.textContent = originalLabel;
        eventSoundFileEl.value = "";
      }
    });

    const source = new EventSource("/events");
    source.onopen = () => {
      refreshState();
    };
    source.onerror = () => {
      setStatus("server disconnected (retrying...)", false);
    };
    source.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        addEvent(payload);
        if (payload.type === "trigger") {
          playTriggerSound(payload.sound_url);
        }
        if (payload.type === "status") {
          const message = String(payload.message || "");
          const ok = !message.toLowerCase().includes("error") && !message.toLowerCase().includes("stopped");
          setStatus(message, ok);
        }
        if (payload.type === "error") {
          setStatus(payload.error || "error", false);
        }
      } catch (_) {
      }
    };

    refreshState();
    refreshMCStatus();
    syncLabelHint();
    loadGiftOptions();
    loadEventsTable();
