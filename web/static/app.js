// =========================
// DOM References & State
// =========================
const statusEl = document.getElementById("status");
    const eventsEl = document.getElementById("events");
    const usernameEl = document.getElementById("username");
    const startBtn = document.getElementById("startBtn");
    const connectBtn = document.getElementById("connectBtn");
    const stopBtn = document.getElementById("stopBtn");
    const mcModeEl = document.getElementById("mcMode");
    const mcEnabledEl = document.getElementById("mcEnabled");
    const mcEnabledLabelEl = document.getElementById("mcEnabledLabel");
    const mcHostEl = document.getElementById("mcHost");
    const mcPortEl = document.getElementById("mcPort");
    const mcPasswordEl = document.getElementById("mcPassword");
    const mcServerTapPathEl = document.getElementById("mcServerTapPath");
    const mcConnectBtn = document.getElementById("mcConnectBtn");
    const mcDisconnectBtn = document.getElementById("mcDisconnectBtn");
    const mcCommandEl = document.getElementById("mcCommand");
    const mcSendBtn = document.getElementById("mcSendBtn");
    const likeGoalTitleEl = document.getElementById("likeGoalTitle");
    const likeGoalValueEl = document.getElementById("likeGoalValue");
    const likeGoalModeEl = document.getElementById("likeGoalMode");
    const likeGoalModePickerHostEl = document.getElementById("likeGoalModePicker");
    const likeGoalTriggerEventEl = document.getElementById("likeGoalTriggerEvent");
    const likeGoalTriggerEventPickerHostEl = document.getElementById("likeGoalTriggerEventPicker");
    const likeGoalEnabledEl = document.getElementById("likeGoalEnabled");
    const likeGoalTestBtn = document.getElementById("likeGoalTestBtn");
    const likeGoalResetBtn = document.getElementById("likeGoalResetBtn");
    const likeGoalOverlayLinkEl = document.getElementById("likeGoalOverlayLink");
    const likeGoalCopyLinkBtn = document.getElementById("likeGoalCopyLinkBtn");
    const likeGoalPreviewTitleEl = document.getElementById("likeGoalPreviewTitle");
    const likeGoalProgressTextEl = document.getElementById("likeGoalProgressText");
    const likeGoalProgressBarEl = document.getElementById("likeGoalProgressBar");
    const languageToggleBtn = document.getElementById("languageToggleBtn");
    const languageFlagIcon = document.getElementById("languageFlagIcon");
    const languageCodeLabel = document.getElementById("languageCodeLabel");
    const testEventTypeEl = document.getElementById("testEventType");
    const testEventUsernameEl = document.getElementById("testEventUsername");
    const testEventGiftEl = document.getElementById("testEventGift");
    const testEventGiftPickerHostEl = document.getElementById("testEventGiftPicker");
    const testEventCountEl = document.getElementById("testEventCount");
    const testEventTextEl = document.getElementById("testEventText");
    const testEventBtn = document.getElementById("testEventBtn");
    const testEventRowEl = document.getElementById("testEventRow");
    const mcOutputEl = document.getElementById("mcOutput");
    const howToUseBtn = document.getElementById("howToUseBtn");
    const howToModalEl = document.getElementById("howToModal");
    const closeHowToModalBtn = document.getElementById("closeHowToModalBtn");
    const eventModalEl = document.getElementById("eventModal");
    const eventBoxModalEl = document.getElementById("eventBoxModal");
    const openEventModalBtn = document.getElementById("openEventModalBtn");
    const presetProfileSelectEl = document.getElementById("presetProfileSelect");
    const savePresetProfileBtn = document.getElementById("savePresetProfileBtn");
    const openCreatePresetProfileModalBtn = document.getElementById("openCreatePresetProfileModalBtn");
    const renamePresetProfileBtn = document.getElementById("renamePresetProfileBtn");
    const createPresetProfileModalEl = document.getElementById("createPresetProfileModal");
    const createPresetProfileModalTitleEl = document.getElementById("createPresetProfileModalTitle");
    const closeCreatePresetProfileModalBtn = document.getElementById("closeCreatePresetProfileModalBtn");
    const cancelCreatePresetProfileBtn = document.getElementById("cancelCreatePresetProfileBtn");
    const createPresetProfileForm = document.getElementById("createPresetProfileForm");
    const createPresetProfileNameEl = document.getElementById("createPresetProfileName");
    const renamePresetProfileModalEl = document.getElementById("renamePresetProfileModal");
    const renamePresetProfileModalTitleEl = document.getElementById("renamePresetProfileModalTitle");
    const closeRenamePresetProfileModalBtn = document.getElementById("closeRenamePresetProfileModalBtn");
    const cancelRenamePresetProfileBtn = document.getElementById("cancelRenamePresetProfileBtn");
    const renamePresetProfileForm = document.getElementById("renamePresetProfileForm");
    const renamePresetProfileNameEl = document.getElementById("renamePresetProfileName");
    const resetEventsBtn = document.getElementById("resetEventsBtn");
    const openEventBoxPopupBtn = document.getElementById("openEventBoxPopupBtn");
    const closeEventModalBtn = document.getElementById("closeEventModalBtn");
    const closeEventBoxPopupBtn = document.getElementById("closeEventBoxPopupBtn");
    const eventModalTitleEl = document.getElementById("eventModalTitle");
    const eventForm = document.getElementById("eventForm");
    const eventTypeEl = document.getElementById("eventType");
    const eventTitleEl = document.getElementById("eventTitle");
    const eventLabelEl = document.getElementById("eventLabel");
    const eventGiftEl = document.getElementById("eventGift");
    const eventGiftPickerHostEl = document.getElementById("eventGiftPicker");
    const eventShortcutPickerHostEl = document.getElementById("eventShortcutPicker");
    const eventSoundEl = document.getElementById("eventSound");
    const pickEventSoundBtn = document.getElementById("pickEventSoundBtn");
    const eventSoundFileEl = document.getElementById("eventSoundFile");
    const eventRunMCCommandEl = document.getElementById("eventRunMCCommand");
    const eventRunShortcutEl = document.getElementById("eventRunShortcut");
    const eventRepeatByGiftComboWrapEl = document.getElementById("eventRepeatByGiftComboWrap");
    const eventRepeatByGiftComboLabelEl = document.getElementById("eventRepeatByGiftComboLabel");
    const eventRepeatByGiftComboEl = document.getElementById("eventRepeatByGiftCombo");
    const eventShowInExportWrapEl = document.getElementById("eventShowInExportWrap");
    const eventShowInExportLabelEl = document.getElementById("eventShowInExportLabel");
    const eventShowInExportEl = document.getElementById("eventShowInExport");
    const eventMCCommandEl = document.getElementById("eventMCCommand");
    const shortcutRowEl = document.getElementById("shortcutRow");
    const eventShortcutKeysEl = document.getElementById("eventShortcutKeys");
    const eventShortcutHoldMsEl = document.getElementById("eventShortcutHoldMs");
    const resetEventBtn = document.getElementById("resetEventBtn");
    const eventRowsEl = document.getElementById("eventRows");
    const eventBoxRowsEl = document.getElementById("eventBoxRows");
    const eventPaginationEl = document.getElementById("eventPagination");
    let eventPrevSlideBtn = document.getElementById("eventPrevSlideBtn");
    let eventNextSlideBtn = document.getElementById("eventNextSlideBtn");
    const exportEventBoxBtn = document.getElementById("exportEventBoxBtn");
    const eventExportStageEl = document.getElementById("eventExportStage");
    const eventBoxRowsPopupEl = document.getElementById("eventBoxRowsPopup");
    const eventPaginationPopupEl = document.getElementById("eventPaginationPopup");
    const connectTikTokTitleEl = document.getElementById("connectTikTokTitle");
    const eventSimulatorTitleEl = document.getElementById("eventSimulatorTitle");
    const minecraftConnectorTitleEl = document.getElementById("minecraftConnectorTitle");
    const likeGoalSectionTitleEl = document.getElementById("likeGoalSectionTitle");
    const likeGoalEnabledLabelEl = document.getElementById("likeGoalEnabledLabel");
    const eventPanelTitleEl = document.getElementById("eventPanelTitle");
    const eventListBoxTitleEl = document.getElementById("eventListBoxTitle");
    const eventBoxPerRowLabelEl = document.getElementById("eventBoxPerRowLabel");
    const eventBoxPerRowEl = document.getElementById("eventBoxPerRow");
    const historyTitleEl = document.getElementById("historyTitle");
    const thTypeEl = document.getElementById("thType");
    const thTitleEl = document.getElementById("thTitle");
    const thLabelEl = document.getElementById("thLabel");
    const thGiftNameEl = document.getElementById("thGiftName");
    const thDiamondEl = document.getElementById("thDiamond");
    const thSoundEl = document.getElementById("thSound");
    const thMCCommandEl = document.getElementById("thMCCommand");
    const thShortcutEl = document.getElementById("thShortcut");
    const thShowInExportEl = document.getElementById("thShowInExport");
    const thModeEl = document.getElementById("thMode");
    const thActionsEl = document.getElementById("thActions");
    const eventPlaceholderTitleEl = document.getElementById("eventPlaceholderTitle");
    const howtoStep1El = document.getElementById("howtoStep1");
    const howtoStep2El = document.getElementById("howtoStep2");
    const howtoStep3El = document.getElementById("howtoStep3");
    const howtoStep4El = document.getElementById("howtoStep4");
    const howtoFooterEl = document.getElementById("howtoFooter");
    const appFooterTextEl = document.getElementById("appFooterText");
    let editingEventId = null;
    let giftOptions = [];
    const MAX_EVENT_HISTORY = 10;
    const EVENT_SLIDE_INTERVAL_MS = 3500;
    let eventSliderTimer = null;
    let currentEventPage = 0;
    let currentEventItems = [];
    let simulateCountdownBusy = false;
    let hasConnectedTikTok = false;
    let giftImageVersion = Date.now();
    let triggerAudioCtx = null;
    let triggerAudioGain = null;
    let triggerAudioUnlocked = false;
    const triggerAudioBufferCache = new Map();
    const activeTriggerAudios = new Set();
    const TOAST_DURATION_MS = 3000;
    const TOAST_EXIT_MS = 260;
    let toastHostEl = null;
    let lastToastSignature = "";
    let lastToastAt = 0;
    let likeGoalState = null;
    let mcRCONPasswordCache = "123";
    let mcServerTapPasswordCache = "change_me";
    let mcRCONPortCache = 25575;
    let mcServerTapPortCache = 4567;
    let activeMinecraftMode = "rcon";
    let presetProfiles = [];
    let renamePresetSourceProfile = "";
    let settingsAutosaveTimer = null;
    let pendingActivePresetProfile = "";
    const I18N_STORAGE_KEY = "gtlc_lang";
    const EVENT_BOX_PER_ROW_STORAGE_KEY = "gtlc_event_box_per_row";
    const ACTIVE_PRESET_PROFILE_STORAGE_KEY = "gtlc_active_preset_profile";
    let currentLang = "id";
    const I18N = {
      id: {
        "ui.howToUse": "Cara Pakai",
        "ui.save": "Simpan",
        "ui.connectTikTok": "Hubungkan TikTok",
        "ui.eventSimulator": "Simulator Event",
        "ui.minecraftConnector": "Konektor Minecraft",
        "ui.minecraftEnabled": "Aktifkan Konektor Minecraft",
        "ui.likeGoal": "Target Like (OBS Overlay)",
        "ui.enabled": "Aktif",
        "ui.testLikeGoal": "Tes Target Like",
        "ui.resetProgress": "Reset Progres",
        "ui.openOverlay": "Buka Overlay",
        "ui.copyLink": "Salin Link",
        "ui.eventPanel": "Panel Event",
        "ui.selectPresetProfile": "Pilih profile preset",
        "ui.saveProfile": "Simpan Profile",
        "ui.newProfile": "Profile Baru",
        "ui.createProfile": "Buat Profile",
        "ui.loadProfile": "Load Profile",
        "ui.renameProfile": "Rename Profile",
        "ui.noPresetProfiles": "Tidak ada profile preset",
        "ui.loadEvents": "Muat Event",
        "ui.resetEvents": "Reset Event",
        "ui.addEvent": "Tambah Event",
        "ui.eventListBox": "Kotak Daftar Event",
        "ui.itemsPerRow": "Isi per baris",
        "ui.savePngSlides": "Simpan PNG Slides",
        "ui.prev": "Sebelumnya",
        "ui.next": "Berikutnya",
        "ui.history": "Riwayat",
        "ui.footerBy": "Dibuat oleh",
        "ui.close": "Tutup",
        "ui.uploadSound": "Unggah Suara",
        "ui.runShortcut": "Jalankan Shortcut Keyboard",
        "ui.runMC": "Jalankan Perintah MC",
        "ui.repeatByGiftCombo": "Repeat by Gift Combo",
        "ui.reset": "Reset",
        "ui.type": "Tipe",
        "ui.title": "Judul",
        "ui.label": "Label",
        "ui.giftName": "Nama Gift",
        "ui.diamond": "Diamond",
        "ui.sound": "Suara",
        "ui.mcCommand": "Perintah MC",
        "ui.shortcut": "Shortcut",
        "ui.showInExport": "Tampil",
        "ui.mode": "Mode",
        "ui.actions": "Aksi",
        "ui.mcOnly": "MC",
        "ui.mcAndShortcut": "MC + Shortcut",
        "ui.run": "Jalankan",
        "ui.edit": "Ubah",
        "ui.duplicate": "Duplikat",
        "ui.delete": "Hapus",
        "ui.placeholderHelp": "Placeholder yang tersedia untuk Perintah MC",
        "ui.simulate": "Simulasi",
        "ui.connect": "Hubungkan",
        "ui.stop": "Berhenti",
        "ui.start": "Mulai",
        "ui.disconnect": "Putuskan",
        "ui.connectRcon": "Hubungkan Minecraft",
        "ui.sendCommand": "Kirim Perintah",
        "ui.likeGoalSelectTrigger": "Pilih event trigger",
        "ui.selectGift": "Pilih Gift",
        "ui.selectShortcut": "Pilih shortcut",
        "ui.selectMode": "Pilih mode",
        "ui.searchGift": "Cari gift...",
        "ui.searchShortcut": "Cari shortcut...",
        "ui.giftNotFound": "Gift tidak ditemukan.",
        "ui.shortcutNotFound": "Shortcut tidak ditemukan.",
        "ui.noEventsYet": "Belum ada event.",
        "ui.noGiftEventsYet": "Belum ada event gift.",
        "ui.eventModalAdd": "Tambah Event",
        "ui.eventModalEdit": "Edit Event",
        "ui.pickButtonClicked": "Tombol \"{button}\" ditekan",
        "howto.step1": "Saat pertama kali membuka aplikasi, masukkan username TikTok lalu tekan Mulai",
        "howto.step2": "Jika server Minecraft sudah berjalan, tekan Hubungkan Minecraft",
        "howto.step3": "Jika siaran langsung TikTok sudah dimulai, tekan Hubungkan",
        "howto.step4": "Untuk menguji event, tekan Jalankan atau gunakan Simulator Event",
        "howto.footer": "Jika belum membeli lisensi bisa melalui WhatsApp",
        "msg.requiredUsername": "username wajib diisi",
        "msg.tracking": "melacak @{username}",
        "msg.idle": "idle (belum terhubung)",
        "msg.fetchStateFailed": "gagal mengambil status",
        "msg.starting": "memulai @{username}...",
        "msg.stopped": "berhenti",
        "msg.serverDisconnectedRetry": "server terputus (mencoba lagi...)",
        "msg.settingsSaved": "pengaturan tersimpan",
        "msg.settingsLoaded": "pengaturan dimuat",
        "msg.eventsReset": "event berhasil direset",
        "msg.eventCreated": "event berhasil dibuat",
        "msg.eventUpdated": "event berhasil diperbarui",
        "msg.eventDeleted": "event berhasil dihapus",
        "msg.eventDuplicated": "event berhasil diduplikasi",
        "msg.overlayCopied": "link overlay disalin",
        "msg.overlayCopyFailed": "gagal menyalin link overlay",
        "msg.likeGoalReset": "progres target like direset",
        "msg.likeGoalTestSent": "tes target like terkirim (progres tidak berubah)",
        "msg.simulateCountdown": "simulasi event dalam {sec} detik...",
        "msg.eventSimulated": "event disimulasikan: {type} @{username}",
        "msg.loadedEventCount": "berhasil memuat {count} event dari JSON",
        "msg.loadedPresetProfile": "profile {name} dimuat ({count} event)",
        "msg.selectPresetProfileFirst": "pilih profile preset terlebih dahulu",
        "msg.enterNewPresetProfileName": "Masukkan nama profile preset baru",
        "msg.presetProfileRenamed": "profile {oldName} diubah menjadi {newName}",
        "msg.profileNameRequired": "nama profile wajib diisi",
        "msg.presetProfileCreated": "profile {name} berhasil dibuat dengan event kosong",
        "msg.editingEvent": "mengedit event #{id}",
        "msg.eventTestSucceeded": "tes event #{id} berhasil",
        "msg.giftRefreshed": "daftar gift diperbarui untuk @{username}{region}{source}",
        "msg.resetEventsConfirm": "Reset semua event dari events.json?",
        "msg.deleteEventConfirm": "Hapus event #{id}?",
        "msg.emptyCommand": "Perintah kosong.",
        "msg.rconConnected": "RCON terhubung.",
        "msg.rconDisconnected": "RCON terputus.",
        "msg.servertapConnected": "ServerTap terhubung.",
        "msg.servertapDisconnected": "ServerTap terputus.",
        "msg.mcConnectorConnectFailed": "gagal terhubung ke konektor Minecraft",
        "msg.mcConnectorDisconnectFailed": "gagal memutuskan konektor Minecraft",
        "msg.mcConnectorDisabled": "konektor Minecraft nonaktif",
        "msg.simulatedOutput": "Simulasi {type} - {message}",
        "msg.noOutput": "(tidak ada output)",
        "msg.uploading": "Mengunggah..."
      },
      en: {
        "ui.howToUse": "How to Use",
        "ui.save": "Save",
        "ui.connectTikTok": "Connect TikTok",
        "ui.eventSimulator": "Event Simulator",
        "ui.minecraftConnector": "Minecraft Connector",
        "ui.minecraftEnabled": "Enable Minecraft Connector",
        "ui.likeGoal": "Like Goal (OBS Overlay)",
        "ui.enabled": "Enabled",
        "ui.testLikeGoal": "Test Like Goal",
        "ui.resetProgress": "Reset Progress",
        "ui.openOverlay": "Open Overlay",
        "ui.copyLink": "Copy Link",
        "ui.eventPanel": "Event Panel",
        "ui.selectPresetProfile": "Select preset profile",
        "ui.saveProfile": "Save Profile",
        "ui.newProfile": "New Profile",
        "ui.createProfile": "Create Profile",
        "ui.loadProfile": "Load Profile",
        "ui.renameProfile": "Rename Profile",
        "ui.noPresetProfiles": "No preset profiles",
        "ui.loadEvents": "Load Events",
        "ui.resetEvents": "Reset Events",
        "ui.addEvent": "Add Event",
        "ui.eventListBox": "Event List Box",
        "ui.itemsPerRow": "Items/Row",
        "ui.savePngSlides": "Save PNG Slides",
        "ui.prev": "Prev",
        "ui.next": "Next",
        "ui.history": "History",
        "ui.footerBy": "Built by",
        "ui.close": "Close",
        "ui.uploadSound": "Upload Sound",
        "ui.runShortcut": "Run Keyboard Shortcut",
        "ui.runMC": "Run MC Command",
        "ui.repeatByGiftCombo": "Repeat by Gift Combo",
        "ui.reset": "Reset",
        "ui.type": "Type",
        "ui.title": "Title",
        "ui.label": "Label",
        "ui.giftName": "Gift Name",
        "ui.diamond": "Diamond",
        "ui.sound": "Sound",
        "ui.mcCommand": "MC Command",
        "ui.shortcut": "Shortcut",
        "ui.showInExport": "Show",
        "ui.mode": "Mode",
        "ui.actions": "Actions",
        "ui.mcOnly": "MC",
        "ui.mcAndShortcut": "MC + Shortcut",
        "ui.run": "Run",
        "ui.edit": "Edit",
        "ui.duplicate": "Duplicate",
        "ui.delete": "Delete",
        "ui.placeholderHelp": "Available placeholders for MC Command",
        "ui.simulate": "Simulate",
        "ui.connect": "Connect",
        "ui.stop": "Stop",
        "ui.start": "Start",
        "ui.disconnect": "Disconnect",
        "ui.connectRcon": "Connect Minecraft",
        "ui.sendCommand": "Send Command",
        "ui.likeGoalSelectTrigger": "Select event trigger",
        "ui.selectGift": "Select Gift",
        "ui.selectShortcut": "Select shortcut",
        "ui.selectMode": "Select mode",
        "ui.searchGift": "Search gift...",
        "ui.searchShortcut": "Search shortcut...",
        "ui.giftNotFound": "Gift not found.",
        "ui.shortcutNotFound": "Shortcut not found.",
        "ui.noEventsYet": "No events yet.",
        "ui.noGiftEventsYet": "No gift events yet.",
        "ui.eventModalAdd": "Add Event",
        "ui.eventModalEdit": "Edit Event",
        "ui.pickButtonClicked": "Button \"{button}\" clicked",
        "howto.step1": "When opening the app for the first time, you must enter the username and press Start",
        "howto.step2": "If your Minecraft server is already running, you can press Connect Minecraft",
        "howto.step3": "If the TikTok live has started, you can press Connect",
        "howto.step4": "If you want to test events, you can press Run or use Event Simulator",
        "howto.footer": "If you have not purchased a license, contact WhatsApp",
        "msg.requiredUsername": "username is required",
        "msg.tracking": "tracking @{username}",
        "msg.idle": "idle (not connected)",
        "msg.fetchStateFailed": "failed to fetch state",
        "msg.starting": "starting @{username}...",
        "msg.stopped": "stopped",
        "msg.serverDisconnectedRetry": "server disconnected (retrying...)",
        "msg.settingsSaved": "settings saved",
        "msg.settingsLoaded": "settings loaded",
        "msg.eventsReset": "events reset successfully",
        "msg.eventCreated": "event created successfully",
        "msg.eventUpdated": "event updated successfully",
        "msg.eventDeleted": "event deleted successfully",
        "msg.eventDuplicated": "event duplicated successfully",
        "msg.overlayCopied": "overlay link copied",
        "msg.overlayCopyFailed": "failed to copy overlay link",
        "msg.likeGoalReset": "like goal progress reset",
        "msg.likeGoalTestSent": "like goal test sent (progress unchanged)",
        "msg.simulateCountdown": "simulate event in {sec}s...",
        "msg.eventSimulated": "event simulated: {type} @{username}",
        "msg.loadedEventCount": "loaded {count} event(s) from JSON",
        "msg.loadedPresetProfile": "profile {name} loaded ({count} event(s))",
        "msg.selectPresetProfileFirst": "select a preset profile first",
        "msg.enterNewPresetProfileName": "Enter new preset profile name",
        "msg.presetProfileRenamed": "profile {oldName} renamed to {newName}",
        "msg.profileNameRequired": "profile name is required",
        "msg.presetProfileCreated": "profile {name} created with empty events",
        "msg.editingEvent": "editing event #{id}",
        "msg.eventTestSucceeded": "event test #{id} succeeded",
        "msg.giftRefreshed": "gift list refreshed for @{username}{region}{source}",
        "msg.resetEventsConfirm": "Reset all events from events.json?",
        "msg.deleteEventConfirm": "Delete event #{id}?",
        "msg.emptyCommand": "Command is empty.",
        "msg.rconConnected": "RCON connected.",
        "msg.rconDisconnected": "RCON disconnected.",
        "msg.servertapConnected": "ServerTap connected.",
        "msg.servertapDisconnected": "ServerTap disconnected.",
        "msg.mcConnectorConnectFailed": "failed to connect Minecraft connector",
        "msg.mcConnectorDisconnectFailed": "failed to disconnect Minecraft connector",
        "msg.mcConnectorDisabled": "minecraft connector is disabled",
        "msg.simulatedOutput": "Simulated {type} - {message}",
        "msg.noOutput": "(no output)",
        "msg.uploading": "Uploading..."
      }
    };

    function t(key, vars = {}) {
      const pack = I18N[currentLang] || I18N.en;
      let out = pack[key] || I18N.en[key] || key;
      for (const [k, v] of Object.entries(vars || {})) {
        out = out.replaceAll("{" + k + "}", String(v));
      }
      return out;
    }

    function translateKnownMessage(raw) {
      const text = String(raw || "").trim();
      if (!text) return "";
      const exactPairs = [
        [I18N.id["msg.requiredUsername"], I18N.en["msg.requiredUsername"]],
        [I18N.id["msg.idle"], I18N.en["msg.idle"]],
        [I18N.id["msg.fetchStateFailed"], I18N.en["msg.fetchStateFailed"]],
        [I18N.id["msg.stopped"], I18N.en["msg.stopped"]],
        [I18N.id["msg.serverDisconnectedRetry"], I18N.en["msg.serverDisconnectedRetry"]],
        [I18N.id["msg.settingsSaved"], I18N.en["msg.settingsSaved"]],
        [I18N.id["msg.settingsLoaded"], I18N.en["msg.settingsLoaded"]],
        [I18N.id["msg.eventsReset"], I18N.en["msg.eventsReset"]],
        [I18N.id["msg.eventCreated"], I18N.en["msg.eventCreated"]],
        [I18N.id["msg.eventUpdated"], I18N.en["msg.eventUpdated"]],
        [I18N.id["msg.eventDeleted"], I18N.en["msg.eventDeleted"]],
        [I18N.id["msg.eventDuplicated"], I18N.en["msg.eventDuplicated"]],
        [I18N.id["msg.overlayCopied"], I18N.en["msg.overlayCopied"]],
        [I18N.id["msg.overlayCopyFailed"], I18N.en["msg.overlayCopyFailed"]],
        [I18N.id["msg.likeGoalReset"], I18N.en["msg.likeGoalReset"]],
        [I18N.id["msg.likeGoalTestSent"], I18N.en["msg.likeGoalTestSent"]],
        [I18N.id["msg.emptyCommand"], I18N.en["msg.emptyCommand"]],
        [I18N.id["msg.rconConnected"], I18N.en["msg.rconConnected"]],
        [I18N.id["msg.rconDisconnected"], I18N.en["msg.rconDisconnected"]],
        [I18N.id["msg.servertapConnected"], I18N.en["msg.servertapConnected"]],
        [I18N.id["msg.servertapDisconnected"], I18N.en["msg.servertapDisconnected"]],
        [I18N.id["msg.mcConnectorConnectFailed"], I18N.en["msg.mcConnectorConnectFailed"]],
        [I18N.id["msg.mcConnectorDisconnectFailed"], I18N.en["msg.mcConnectorDisconnectFailed"]],
        [I18N.id["msg.noOutput"], I18N.en["msg.noOutput"]],
        [I18N.id["msg.uploading"], I18N.en["msg.uploading"]]
      ];
      for (const pair of exactPairs) {
        if (text === pair[0] || text === pair[1]) {
          return currentLang === "id" ? pair[0] : pair[1];
        }
      }

      let m = text.match(/^tracking @(.+)$/i) || text.match(/^melacak @(.+)$/i);
      if (m) return t("msg.tracking", { username: m[1] });
      m = text.match(/^starting @(.+)\.\.\.$/i) || text.match(/^memulai @(.+)\.\.\.$/i);
      if (m) return t("msg.starting", { username: m[1] });
      m = text.match(/^connected to @(.+)$/i) || text.match(/^terhubung ke @(.+)$/i);
      if (m) return currentLang === "id" ? ("terhubung ke @" + m[1]) : ("connected to @" + m[1]);
      m = text.match(/^disconnected from @(.+)\. reconnecting in (\d+)s\.\.\.$/i) || text.match(/^terputus dari @(.+)\. mencoba lagi dalam (\d+) detik\.\.\.$/i);
      if (m) return currentLang === "id"
        ? ("terputus dari @" + m[1] + ". mencoba lagi dalam " + m[2] + " detik...")
        : ("disconnected from @" + m[1] + ". reconnecting in " + m[2] + "s...");
      m = text.match(/^RCON disconnected for (\d+)s and reconnected before connecting @(.+)$/i) || text.match(/^RCON diputus selama (\d+) detik lalu tersambung lagi sebelum terhubung ke @(.+)$/i);
      if (m) return currentLang === "id"
        ? ("RCON diputus selama " + m[1] + " detik lalu tersambung lagi sebelum terhubung ke @" + m[2])
        : ("RCON disconnected for " + m[1] + "s and reconnected before connecting @" + m[2]);
      m = text.match(/^Minecraft connector \((.+)\) disconnected for (\d+)s and reconnected before connecting @(.+)$/i)
        || text.match(/^Konektor Minecraft \((.+)\) diputus selama (\d+) detik lalu tersambung lagi sebelum terhubung ke @(.+)$/i);
      if (m) return currentLang === "id"
        ? ("Konektor Minecraft (" + m[1] + ") diputus selama " + m[2] + " detik lalu tersambung lagi sebelum terhubung ke @" + m[3])
        : ("Minecraft connector (" + m[1] + ") disconnected for " + m[2] + "s and reconnected before connecting @" + m[3]);
      m = text.match(/^Minecraft connector \((.+)\) status after TikTok reconnect @(.+): connected=(true|false) \((.+):(.+)\)$/i)
        || text.match(/^Status konektor Minecraft \((.+)\) setelah reconnect TikTok @(.+): connected=(true|false) \((.+):(.+)\)$/i);
      if (m) return currentLang === "id"
        ? ("Status konektor Minecraft (" + m[1] + ") setelah reconnect TikTok @" + m[2] + ": connected=" + m[3] + " (" + m[4] + ":" + m[5] + ")")
        : ("Minecraft connector (" + m[1] + ") status after TikTok reconnect @" + m[2] + ": connected=" + m[3] + " (" + m[4] + ":" + m[5] + ")");
      m = text.match(/^@(.+) is not live yet\. rechecking in (\d+)s\.\.\.$/i) || text.match(/^@(.+) belum live\. cek ulang dalam (\d+) detik\.\.\.$/i);
      if (m) return currentLang === "id"
        ? ("@" + m[1] + " belum live. cek ulang dalam " + m[2] + " detik...")
        : ("@" + m[1] + " is not live yet. rechecking in " + m[2] + "s...");
      m = text.match(/^simulate event in (\d+)s\.\.\.$/i) || text.match(/^simulasi event dalam (\d+) detik\.\.\.$/i);
      if (m) return t("msg.simulateCountdown", { sec: m[1] });
      m = text.match(/^event simulated: (.+) @(.+)$/i) || text.match(/^event disimulasikan: (.+) @(.+)$/i);
      if (m) return t("msg.eventSimulated", { type: m[1], username: m[2] });
      m = text.match(/^loaded (\d+) event\(s\) from JSON$/i) || text.match(/^berhasil memuat (\d+) event dari JSON$/i);
      if (m) return t("msg.loadedEventCount", { count: m[1] });
      m = text.match(/^editing event #(\d+)$/i) || text.match(/^mengedit event #(\d+)$/i);
      if (m) return t("msg.editingEvent", { id: m[1] });
      m = text.match(/^event test #(\d+) succeeded$/i) || text.match(/^tes event #(\d+) berhasil$/i);
      if (m) return t("msg.eventTestSucceeded", { id: m[1] });
      m = text.match(/^gift list refreshed for @([^(\[]+)(.*)$/i) || text.match(/^daftar gift diperbarui untuk @([^(\[]+)(.*)$/i);
      if (m) {
        const username = String(m[1] || "").trim();
        const suffix = String(m[2] || "");
        return t("msg.giftRefreshed", {
          username,
          region: suffix.includes("(") ? suffix.slice(suffix.indexOf("("), suffix.includes("[") ? suffix.indexOf("[") : undefined).trim() : "",
          source: suffix.includes("[") ? " " + suffix.slice(suffix.indexOf("[")).trim() : ""
        });
      }
      m = text.match(/^gift list saved to (.+) and downloaded (\d+) gift image\(s\) to (.+)$/i) || text.match(/^daftar gift tersimpan di (.+) dan (\d+) gambar gift terunduh ke (.+)$/i);
      if (m) {
        return currentLang === "id"
          ? ("daftar gift tersimpan di " + m[1] + " dan " + m[2] + " gambar gift terunduh ke " + m[3])
          : ("gift list saved to " + m[1] + " and downloaded " + m[2] + " gift image(s) to " + m[3]);
      }
      m = text.match(/^Simulated (.+) - (.+)$/i) || text.match(/^Simulasi (.+) - (.+)$/i);
      if (m) return t("msg.simulatedOutput", { type: m[1], message: m[2] });
      m = text.match(/^like goal test sent \(no trigger event configured\)$/i) || text.match(/^tes target like terkirim \(event trigger belum diatur\)$/i);
      if (m) return currentLang === "id" ? "tes target like terkirim (event trigger belum diatur)" : "like goal test sent (no trigger event configured)";
      m = text.match(/^events\.json has been reset$/i) || text.match(/^events\.json berhasil direset$/i);
      if (m) return currentLang === "id" ? "events.json berhasil direset" : "events.json has been reset";
      m = text.match(/^you have not purchased a license\. contact \+?(\d+)$/i) || text.match(/^anda belum membeli lisensi\. hubungi \+?(\d+)$/i);
      if (m) return currentLang === "id" ? ("anda belum membeli lisensi. hubungi +" + m[1]) : ("you have not purchased a license. contact +" + m[1]);
      m = text.match(/^failed to reconnect RCON before connecting @(.+): (.+)$/i) || text.match(/^gagal reconnect RCON sebelum terhubung ke @(.+): (.+)$/i);
      if (m) return currentLang === "id"
        ? ("gagal reconnect RCON sebelum terhubung ke @" + m[1] + ": " + m[2])
        : ("failed to reconnect RCON before connecting @" + m[1] + ": " + m[2]);
      m = text.match(/^tracker panic for @(.+): (.+)$/i) || text.match(/^panic tracker untuk @(.+): (.+)$/i);
      if (m) return currentLang === "id"
        ? ("panic tracker untuk @" + m[1] + ": " + m[2])
        : ("tracker panic for @" + m[1] + ": " + m[2]);

      const phrasePairs = [
        ["invalid upload payload", "payload unggah tidak valid"],
        ["invalid request body", "body request tidak valid"],
        ["method not allowed", "metode tidak diizinkan"],
        ["failed to reconnect rcon before connecting", "gagal reconnect rcon sebelum terhubung ke"],
        ["rcon disconnected for", "rcon diputus selama"],
        ["and reconnected before connecting", "dan tersambung lagi sebelum terhubung ke"],
        ["tracker panic for", "panic tracker untuk"],
        ["failed to sync like goal on startup", "gagal sinkron target like saat startup"],
        ["failed load properties", "gagal memuat properti"],
        ["failed to load page", "gagal memuat halaman"],
        ["json marshal failed", "gagal memproses json"],
        ["failed to fetch gift catalog", "gagal mengambil katalog gift"],
        ["failed to save gift list json", "gagal menyimpan json daftar gift"],
        ["failed to read gift list", "gagal membaca daftar gift"],
        ["gift image download completed", "unduh gambar gift selesai"],
        ["rcon password is required for manual connect", "password rcon wajib diisi untuk koneksi manual"],
        ["rcon.password is empty", "rcon.password kosong"],
        ["enable-rcon=false in server/server.properties", "enable-rcon=false di server/server.properties"],
        ["rcon is not connected", "rcon belum terhubung"],
        ["servertap is not connected", "servertap belum terhubung"],
        ["servertap request failed", "request servertap gagal"],
        ["minecraft connector", "konektor minecraft"],
        ["command is empty", "perintah kosong"],
        ["username is required", "username wajib diisi"],
        ["failed to create sound directory", "gagal membuat folder suara"],
        ["failed to save sound file", "gagal menyimpan file suara"],
        ["failed to write sound file", "gagal menulis file suara"],
        ["unsupported sound format", "format suara tidak didukung"],
        ["sound file is required", "file suara wajib diisi"],
        ["event json file is required", "file json event wajib diisi"],
        ["failed to read event file", "gagal membaca file event"],
        ["failed to save imported events", "gagal menyimpan event impor"],
        ["failed to reset like goal progress", "gagal reset progres target like"],
        ["failed to reset events", "gagal reset event"],
        ["failed to save settings", "gagal menyimpan pengaturan"],
        ["failed to load settings", "gagal memuat pengaturan"],
        ["failed to build export json", "gagal membuat json ekspor"],
        ["unsupported test event type", "tipe event simulasi tidak didukung"],
        ["trigger event not found", "event trigger tidak ditemukan"],
        ["event not found", "event tidak ditemukan"],
        ["gift_id not found in gift list", "gift_id tidak ditemukan di daftar gift"],
        ["is not live yet", "belum live"],
        ["rechecking in", "cek ulang dalam"],
        ["disconnected from", "terputus dari"],
        ["reconnecting in", "mencoba lagi dalam"],
        ["connected to", "terhubung ke"],
        ["tracking", "melacak"],
        ["starting", "memulai"],
        ["stopped", "berhenti"],
        ["failed to", "gagal"],
        ["failed", "gagal"],
        ["is required", "wajib diisi"],
        ["required", "wajib diisi"],
        ["not found", "tidak ditemukan"],
        ["unsupported", "tidak didukung"]
      ];

      const fromIndex = currentLang === "id" ? 0 : 1;
      const toIndex = currentLang === "id" ? 1 : 0;
      let out = text;
      for (const pair of phrasePairs) {
        const from = pair[fromIndex];
        const to = pair[toIndex];
        if (!from || !to) continue;
        out = out.replace(new RegExp(from.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"), "ig"), to);
      }
      return out;
    }

    function applyLanguageUI() {
      document.documentElement.lang = currentLang;
      const isID = currentLang === "id";
      if (languageFlagIcon) {
        languageFlagIcon.src = isID ? "/static/flags/id.svg" : "/static/flags/en.svg";
        languageFlagIcon.alt = isID ? "Indonesia flag" : "English flag";
      }
      if (languageCodeLabel) {
        languageCodeLabel.textContent = isID ? "ID" : "EN";
      }
      if (languageToggleBtn) {
        languageToggleBtn.setAttribute("aria-label", isID ? "Switch to English" : "Ganti ke Bahasa Indonesia");
        languageToggleBtn.title = isID ? "Switch to English" : "Ganti ke Bahasa Indonesia";
      }
      document.title = "TikStream";
      if (howToUseBtn) howToUseBtn.textContent = t("ui.howToUse");
      if (connectTikTokTitleEl) connectTikTokTitleEl.textContent = t("ui.connectTikTok");
      if (eventSimulatorTitleEl) eventSimulatorTitleEl.textContent = t("ui.eventSimulator");
      if (minecraftConnectorTitleEl) minecraftConnectorTitleEl.textContent = t("ui.minecraftConnector");
      if (likeGoalSectionTitleEl) likeGoalSectionTitleEl.textContent = t("ui.likeGoal");
      if (eventPanelTitleEl) eventPanelTitleEl.textContent = t("ui.eventPanel");
      if (eventListBoxTitleEl) eventListBoxTitleEl.textContent = t("ui.eventListBox");
      if (eventBoxPerRowLabelEl) {
        const input = eventBoxPerRowLabelEl.querySelector("select");
        eventBoxPerRowLabelEl.textContent = t("ui.itemsPerRow");
        if (input) eventBoxPerRowLabelEl.appendChild(input);
      }
      if (eventBoxPerRowEl) {
        eventBoxPerRowEl.setAttribute("aria-label", t("ui.itemsPerRow"));
        eventBoxPerRowEl.title = t("ui.itemsPerRow");
      }
      if (historyTitleEl) historyTitleEl.textContent = t("ui.history");
      if (appFooterTextEl) appFooterTextEl.textContent = t("ui.footerBy");
      if (thTypeEl) thTypeEl.textContent = t("ui.type");
      if (thTitleEl) thTitleEl.textContent = t("ui.title");
      if (thLabelEl) thLabelEl.textContent = t("ui.label");
      if (thGiftNameEl) thGiftNameEl.textContent = t("ui.giftName");
      if (thDiamondEl) thDiamondEl.textContent = t("ui.diamond");
      if (thSoundEl) thSoundEl.textContent = t("ui.sound");
      if (thMCCommandEl) thMCCommandEl.textContent = t("ui.mcCommand");
      if (thShortcutEl) thShortcutEl.textContent = t("ui.shortcut");
      if (thShowInExportEl) thShowInExportEl.textContent = t("ui.showInExport");
      if (thModeEl) thModeEl.textContent = t("ui.mode");
      if (thActionsEl) thActionsEl.textContent = t("ui.actions");
      if (eventPlaceholderTitleEl) eventPlaceholderTitleEl.textContent = t("ui.placeholderHelp");
      if (startBtn) startBtn.textContent = t("ui.start");
      if (connectBtn) connectBtn.textContent = t("ui.connect");
      if (stopBtn) stopBtn.textContent = t("ui.stop");
      if (mcConnectBtn) mcConnectBtn.textContent = t("ui.connectRcon");
      if (mcDisconnectBtn) mcDisconnectBtn.textContent = t("ui.disconnect");
      if (mcSendBtn) mcSendBtn.textContent = t("ui.sendCommand");
      if (testEventBtn) testEventBtn.textContent = t("ui.simulate");
      if (savePresetProfileBtn) savePresetProfileBtn.textContent = t("ui.saveProfile");
      if (openCreatePresetProfileModalBtn) openCreatePresetProfileModalBtn.textContent = t("ui.newProfile");
      if (renamePresetProfileBtn) renamePresetProfileBtn.textContent = t("ui.renameProfile");
      if (closeCreatePresetProfileModalBtn) closeCreatePresetProfileModalBtn.textContent = t("ui.close");
      if (cancelCreatePresetProfileBtn) cancelCreatePresetProfileBtn.textContent = t("ui.close");
      if (closeRenamePresetProfileModalBtn) closeRenamePresetProfileModalBtn.textContent = t("ui.close");
      if (cancelRenamePresetProfileBtn) cancelRenamePresetProfileBtn.textContent = t("ui.close");
      if (presetProfileSelectEl) {
        presetProfileSelectEl.setAttribute("aria-label", t("ui.selectPresetProfile"));
        presetProfileSelectEl.title = t("ui.selectPresetProfile");
      }
      if (resetEventsBtn) resetEventsBtn.textContent = t("ui.resetEvents");
      if (openEventModalBtn) openEventModalBtn.textContent = t("ui.addEvent");
      if (exportEventBoxBtn) exportEventBoxBtn.textContent = t("ui.savePngSlides");
      if (eventPrevSlideBtn) eventPrevSlideBtn.textContent = t("ui.prev");
      if (eventNextSlideBtn) eventNextSlideBtn.textContent = t("ui.next");
      if (closeEventModalBtn) closeEventModalBtn.textContent = t("ui.close");
      if (closeHowToModalBtn) closeHowToModalBtn.textContent = t("ui.close");
      if (pickEventSoundBtn) pickEventSoundBtn.textContent = t("ui.uploadSound");
      if (resetEventBtn) resetEventBtn.textContent = t("ui.reset");
      if (likeGoalTestBtn) likeGoalTestBtn.textContent = t("ui.testLikeGoal");
      if (likeGoalResetBtn) likeGoalResetBtn.textContent = t("ui.resetProgress");
      if (likeGoalOverlayLinkEl) likeGoalOverlayLinkEl.textContent = t("ui.openOverlay");
      if (likeGoalCopyLinkBtn) likeGoalCopyLinkBtn.textContent = t("ui.copyLink");
      if (likeGoalEnabledLabelEl) {
        const input = likeGoalEnabledLabelEl.querySelector("input");
        likeGoalEnabledLabelEl.textContent = "";
        if (input) likeGoalEnabledLabelEl.appendChild(input);
        likeGoalEnabledLabelEl.appendChild(document.createTextNode(" " + t("ui.enabled")));
      }
      if (mcEnabledLabelEl) {
        const input = mcEnabledLabelEl.querySelector("input");
        mcEnabledLabelEl.textContent = "";
        if (input) mcEnabledLabelEl.appendChild(input);
        mcEnabledLabelEl.appendChild(document.createTextNode(" " + t("ui.minecraftEnabled")));
      }
      if (eventRepeatByGiftComboLabelEl) {
        const input = eventRepeatByGiftComboLabelEl.querySelector("input");
        eventRepeatByGiftComboLabelEl.textContent = "";
        if (input) eventRepeatByGiftComboLabelEl.appendChild(input);
        eventRepeatByGiftComboLabelEl.appendChild(document.createTextNode(" " + t("ui.repeatByGiftCombo")));
      }
      if (eventShowInExportLabelEl) {
        const input = eventShowInExportLabelEl.querySelector("input");
        eventShowInExportLabelEl.textContent = "";
        if (input) eventShowInExportLabelEl.appendChild(input);
        eventShowInExportLabelEl.appendChild(document.createTextNode(" " + t("ui.showInExport")));
      }
      if (testEventUsernameEl) testEventUsernameEl.placeholder = currentLang === "id" ? "Username TikTok tester" : "Tester TikTok username";
      if (testEventCountEl) testEventCountEl.placeholder = currentLang === "id" ? "Jumlah" : "Count";
      if (testEventTextEl) testEventTextEl.placeholder = currentLang === "id" ? "Teks/Pesan (opsional)" : "Text/Message (optional)";
      if (usernameEl) usernameEl.placeholder = currentLang === "id" ? "Username TikTok, misal example" : "TikTok username, e.g. example";
      if (mcHostEl) mcHostEl.placeholder = currentLang === "id" ? "Host (contoh 127.0.0.1)" : "Host (e.g. 127.0.0.1)";
      if (mcPortEl) mcPortEl.placeholder = currentLang === "id" ? "Port (contoh 25575)" : "Port (e.g. 25575)";
      if (mcServerTapPathEl) mcServerTapPathEl.placeholder = currentLang === "id" ? "Path ServerTap (contoh /v1/server/exec)" : "ServerTap path (e.g. /v1/server/exec)";
      if (mcPasswordEl) mcPasswordEl.placeholder = currentLang === "id" ? "Password RCON / Token ServerTap" : "RCON password / ServerTap token";
      if (eventTitleEl) eventTitleEl.placeholder = currentLang === "id" ? "Judul untuk Event List Box" : "Title for Event List Box";
      if (eventLabelEl) eventLabelEl.placeholder = currentLang === "id" ? "Label/filter rule (opsional)" : "Rule label/filter (optional)";
      if (eventSoundEl) eventSoundEl.placeholder = currentLang === "id" ? "URL/path suara (opsional, contoh /static/sounds/trigger.mp3)" : "Sound URL/path (optional, e.g. /static/sounds/trigger.mp3)";
      if (eventShortcutHoldMsEl) eventShortcutHoldMsEl.placeholder = currentLang === "id" ? "Tahan" : "Hold";
      if (createPresetProfileModalTitleEl) createPresetProfileModalTitleEl.textContent = t("ui.createProfile");
      if (createPresetProfileNameEl) createPresetProfileNameEl.placeholder = currentLang === "id" ? "Nama profile (tanpa P-)" : "Profile name (without P-)";
      if (renamePresetProfileModalTitleEl) renamePresetProfileModalTitleEl.textContent = t("ui.renameProfile");
      if (renamePresetProfileNameEl) renamePresetProfileNameEl.placeholder = currentLang === "id" ? "Nama profile baru (tanpa P-)" : "New profile name (without P-)";
      if (howToModalEl) {
        const title = document.getElementById("howToModalTitle");
        if (title) title.textContent = t("ui.howToUse");
      }
      if (howtoStep1El) howtoStep1El.textContent = t("howto.step1");
      if (howtoStep2El) howtoStep2El.textContent = t("howto.step2");
      if (howtoStep3El) howtoStep3El.textContent = t("howto.step3");
      if (howtoStep4El) howtoStep4El.textContent = t("howto.step4");
      if (howtoFooterEl) {
        howtoFooterEl.innerHTML = esc(t("howto.footer")) + ": " +
          "<a href=\"https://wa.me/6285156560055\" target=\"_blank\" rel=\"noopener noreferrer\">MASJUP</a>";
      }
      if (eventGiftPicker && typeof eventGiftPicker.setPlaceholder === "function") eventGiftPicker.setPlaceholder(t("ui.selectGift"));
      if (testEventGiftPicker && typeof testEventGiftPicker.setPlaceholder === "function") testEventGiftPicker.setPlaceholder(t("ui.selectGift"));
      if (eventShortcutPicker && typeof eventShortcutPicker.setPlaceholder === "function") eventShortcutPicker.setPlaceholder(t("ui.selectShortcut"));
      if (likeGoalModePicker && typeof likeGoalModePicker.setPlaceholder === "function") likeGoalModePicker.setPlaceholder(t("ui.selectMode"));
      if (likeGoalTriggerPicker && typeof likeGoalTriggerPicker.setPlaceholder === "function") likeGoalTriggerPicker.setPlaceholder(t("ui.likeGoalSelectTrigger"));
      if (likeGoalModePicker && typeof likeGoalModePicker.setOptions === "function") {
        likeGoalModePicker.setOptions([
          { value: "increase", label: currentLang === "id" ? "naik" : "increase" },
          { value: "double", label: currentLang === "id" ? "lipat dua" : "double" }
        ]);
        if (likeGoalModeEl && likeGoalState) {
          const modeID = Math.max(0, Number(likeGoalState.mode_id || 0));
          const mode = modeID === 2 ? "double" : (String(likeGoalState.mode || "increase").toLowerCase() === "double" ? "double" : "increase");
          likeGoalModeEl.value = mode;
        }
        likeGoalModePicker.syncFromSelect();
      }
      const setOpt = (selectEl, value, label) => {
        if (!selectEl) return;
        const opt = selectEl.querySelector("option[value=\"" + value + "\"]");
        if (opt) opt.textContent = label;
      };
      setOpt(testEventTypeEl, "gift", currentLang === "id" ? "Event Gift" : "GiftEvent");
      setOpt(testEventTypeEl, "chat", currentLang === "id" ? "Event Chat" : "ChatEvent");
      setOpt(testEventTypeEl, "user_join", currentLang === "id" ? "Event User (Masuk)" : "UserEvent (Join)");
      setOpt(testEventTypeEl, "user_follow", currentLang === "id" ? "Event User (Follow)" : "UserEvent (Follow)");
      setOpt(testEventTypeEl, "user_share", currentLang === "id" ? "Event User (Share)" : "UserEvent (Share)");
      setOpt(testEventTypeEl, "like", currentLang === "id" ? "Event Like" : "LikeEvent");
      setOpt(eventTypeEl, "gift", currentLang === "id" ? "gift" : "gift");
      setOpt(eventTypeEl, "join", currentLang === "id" ? "join" : "join");
      setOpt(eventTypeEl, "follow", currentLang === "id" ? "follow" : "follow");
      setOpt(eventTypeEl, "comment", currentLang === "id" ? "comment" : "comment");
      setOpt(eventTypeEl, "like", currentLang === "id" ? "like" : "like");
      setOpt(eventTypeEl, "share", currentLang === "id" ? "share" : "share");
      setOpt(eventTypeEl, "other", currentLang === "id" ? "other" : "other");
      setOpt(likeGoalModeEl, "increase", currentLang === "id" ? "naik" : "increase");
      setOpt(likeGoalModeEl, "double", currentLang === "id" ? "lipat dua" : "double");
      renderPresetProfileOptions(presetProfileSelectEl ? presetProfileSelectEl.value : "");
      syncLabelHint();
      syncTestEventFields();
      syncMinecraftConnectorModeUI();
      renderEventRows(currentEventItems);
    }

    // =========================
    // Toast Helpers
    // =========================

    function ensureToastHost() {
      if (toastHostEl && document.body.contains(toastHostEl)) return toastHostEl;
      toastHostEl = document.createElement("div");
      toastHostEl.className = "toast-host";
      toastHostEl.setAttribute("aria-live", "polite");
      toastHostEl.setAttribute("aria-atomic", "false");
      document.body.appendChild(toastHostEl);
      return toastHostEl;
    }

    function detectToastType(message, explicitType) {
      if (explicitType === "success" || explicitType === "error" || explicitType === "info") {
        return explicitType;
      }
      const msg = String(message || "").toLowerCase();
      if (!msg) return "info";
      if (msg.includes("error") || msg.includes("failed") || msg.includes("required") || msg.includes("disconnect") || msg.includes("empty") || msg.includes("gagal") || msg.includes("wajib") || msg.includes("kosong") || msg.includes("terputus")) {
        return "error";
      }
      if (msg.includes("success") || msg.includes("connected") || msg.includes("created") || msg.includes("updated") || msg.includes("loaded") || msg.includes("starting") || msg.includes("berhasil") || msg.includes("terhubung") || msg.includes("memulai")) {
        return "success";
      }
      return "info";
    }

    function showFloatingToast(message, type, durationMs = TOAST_DURATION_MS) {
      const text = String(message || "").trim();
      if (!text) return;

      const now = Date.now();
      const toastType = detectToastType(text, type);
      const signature = toastType + "::" + text;
      if (signature === lastToastSignature && now - lastToastAt < 800) return;
      lastToastSignature = signature;
      lastToastAt = now;

      const host = ensureToastHost();
      const toast = document.createElement("div");
      toast.className = "toast toast-" + toastType;
      toast.setAttribute("role", "status");
      toast.textContent = text;
      host.appendChild(toast);

      const visibleDuration = Math.max(TOAST_EXIT_MS, Number(durationMs) || TOAST_DURATION_MS);
      const hideAfter = Math.max(0, visibleDuration - TOAST_EXIT_MS);

      window.setTimeout(() => {
        toast.classList.add("toast-hide");
      }, hideAfter);

      window.setTimeout(() => {
        toast.remove();
      }, visibleDuration + 20);
    }

    function setupGlobalButtonToasts() {
      document.addEventListener("click", (event) => {
        const btn = event.target.closest("button");
        if (!btn) return;
        if (btn.closest(".gift-picker")) return;
        if (btn.id === "languageToggleBtn") return;
        if (btn.dataset.toastIgnore === "1") return;
        const buttonText = String(btn.textContent || "").trim() || "Button";
        showFloatingToast(t("ui.pickButtonClicked", { button: buttonText }), "info", TOAST_DURATION_MS);
      });
    }

    function ensureEventSlideNavButtons() {
      const showcaseEl = document.querySelector(".event-showcase");
      if (!showcaseEl) return;

      let prevBtn = document.getElementById("eventPrevSlideBtn");
      let nextBtn = document.getElementById("eventNextSlideBtn");
      if (prevBtn && nextBtn) {
        eventPrevSlideBtn = prevBtn;
        eventNextSlideBtn = nextBtn;
        return;
      }

      const navWrap = document.createElement("div");
      navWrap.className = "event-slide-nav event-slide-nav-bottom";
      navWrap.setAttribute("aria-label", "Slide navigation");

      if (!prevBtn) {
        prevBtn = document.createElement("button");
        prevBtn.id = "eventPrevSlideBtn";
        prevBtn.type = "button";
        prevBtn.textContent = "Prev";
      }
      if (!nextBtn) {
        nextBtn = document.createElement("button");
        nextBtn.id = "eventNextSlideBtn";
        nextBtn.type = "button";
        nextBtn.textContent = "Next";
      }

      navWrap.appendChild(prevBtn);
      navWrap.appendChild(nextBtn);

      showcaseEl.appendChild(navWrap);

      eventPrevSlideBtn = prevBtn;
      eventNextSlideBtn = nextBtn;
    }

    ensureEventSlideNavButtons();

    // =========================
    // Picker / Shortcut Helpers
    // =========================
    function normalizeShortcutSymbols(shortcut) {
      const raw = String(shortcut || "").trim();
      if (!raw) return "";
      const symbolMap = {
        DOT: ".",
        COMMA: ",",
        SLASH: "/",
        BACKSLASH: "\\",
        MINUS: "-",
        EQUAL: "=",
        SEMICOLON: ";",
        QUOTE: "'",
        BACKTICK: "`",
        OPENBRACKET: "[",
        CLOSEBRACKET: "]",
        QUESTION: "?",
        EXCLAMATION: "!",
        AT: "@",
        HASH: "#",
        DOLLAR: "$",
        AMPERSAND: "&",
        ASTERISK: "*",
        UNDERSCORE: "_",
        COLON: ":",
        DOUBLEQUOTE: "\"",
        LESS: "<",
        GREATER: ">"
      };
      return raw
        .split("+")
        .map((part) => {
          const token = String(part || "").trim();
          if (!token) return token;
          const mapped = symbolMap[token.toUpperCase()];
          return mapped || token;
        })
        .join("+");
    }

    function buildShortcutOptions() {
      const keys = [];
      const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ".split("");
      const digits = "0123456789".split("");
      const funcs = Array.from({ length: 12 }, (_, i) => "F" + String(i + 1));
      const nav = ["ENTER", "TAB", "ESC", "SPACE", "UP", "DOWN", "LEFT", "RIGHT", "HOME", "END", "PGUP", "PGDN", "DELETE", "INSERT"];
      const symbols = [
        ".", ",", "/", "\\", "-", "=", ";", "'",
        "`", "[", "]"
      ];

      const baseKeys = [...letters, ...digits, ...funcs, ...nav, ...symbols];
      const modifiers = ["", "CTRL+", "ALT+", "SHIFT+", "CTRL+SHIFT+", "ALT+SHIFT+"];

      for (const mod of modifiers) {
        for (const key of baseKeys) {
          keys.push(mod + key);
        }
      }

      return Array.from(new Set(keys));
    }

    const shortcutOptions = buildShortcutOptions();

    function setStatus(text, isOK, options = {}) {
      const localized = translateKnownMessage(text);
      if (statusEl) {
        statusEl.textContent = localized;
        if (isOK) statusEl.classList.add("ok");
        else statusEl.classList.remove("ok");
      }

      if (options.toast === false) return;
      const toastType = isOK ? "success" : detectToastType(localized);
      showFloatingToast(localized, toastType, TOAST_DURATION_MS);
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
      if (!res.ok) throw new Error(data.error || (currentLang === "id" ? "gagal mengunggah suara" : "failed to upload sound"));
      return data;
    }

    async function loadEventsFromPresetProfile(fileName) {
      const res = await fetch("/api/events/load-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile_name: String(fileName || "").trim() })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || (currentLang === "id" ? "gagal memuat profile preset" : "failed to load preset profile"));
      return data;
    }

    async function applySelectedPresetProfile(profileName) {
      const name = String(profileName || "").trim();
      if (!name) return;
      const result = await loadEventsFromPresetProfile(name);
      if (result && result.settings) {
        applyLoadedSettings(result.settings);
      }
      if (result && result.like_goal_state) {
        renderLikeGoalState(result.like_goal_state);
      }
      await loadEventsTable();
      resetEventForm();
      closeEventModal();
      try {
        localStorage.setItem(ACTIVE_PRESET_PROFILE_STORAGE_KEY, name);
      } catch (_) {}
      setStatus(t("msg.loadedPresetProfile", {
        name,
        count: String(result.count || 0)
      }), true);
    }

    function getSelectedPresetProfileName() {
      return String(presetProfileSelectEl && presetProfileSelectEl.value ? presetProfileSelectEl.value : "").trim();
    }

    async function persistActivePresetProfile(options = {}) {
      const silent = options.silent !== false;
      const profileName = getSelectedPresetProfileName();
      if (!profileName) return false;
      const res = await fetch("/api/events/save-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile_name: profileName })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || (currentLang === "id" ? "gagal menyimpan profile preset" : "failed to save preset profile"));
      try {
        localStorage.setItem(ACTIVE_PRESET_PROFILE_STORAGE_KEY, profileName);
      } catch (_) {}
      if (!silent) {
        setStatus((currentLang === "id" ? "profile " : "profile ") + profileName + (currentLang === "id" ? " tersimpan" : " saved"), true);
      }
      return true;
    }

    async function renamePresetProfile(oldFileName, newFileName) {
      const res = await fetch("/api/events/rename-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          old_profile_name: String(oldFileName || "").trim(),
          new_profile_name: String(newFileName || "").trim()
        })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || (currentLang === "id" ? "gagal rename profile preset" : "failed to rename preset profile"));
      return data;
    }

    async function createPresetProfile(profileName) {
      const res = await fetch("/api/events/create-profile", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ profile_name: String(profileName || "").trim() })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || (currentLang === "id" ? "gagal membuat profile preset" : "failed to create preset profile"));
      return data;
    }

    function renderPresetProfileOptions(selectedValue) {
      if (!presetProfileSelectEl) return;
      let selected = String(selectedValue || "").trim();
      if (!selected) {
        selected = String(pendingActivePresetProfile || "").trim();
      }
      presetProfileSelectEl.innerHTML = "";

      const defaultOpt = document.createElement("option");
      defaultOpt.value = "";
      defaultOpt.textContent = t("ui.selectPresetProfile");
      presetProfileSelectEl.appendChild(defaultOpt);

      for (const profile of presetProfiles) {
        const name = String(profile && profile.profile_name ? profile.profile_name : "").trim();
        if (!name) continue;
        const opt = document.createElement("option");
        opt.value = name;
        opt.textContent = name;
        presetProfileSelectEl.appendChild(opt);
      }

      if (presetProfiles.length === 0) {
        const emptyOpt = document.createElement("option");
        emptyOpt.value = "";
        emptyOpt.textContent = t("ui.noPresetProfiles");
        emptyOpt.disabled = true;
        presetProfileSelectEl.appendChild(emptyOpt);
      }

      const hasSelected = selected && presetProfiles.some((p) => String(p && p.profile_name ? p.profile_name : "").trim() === selected);
      presetProfileSelectEl.value = hasSelected ? selected : "";
      if (hasSelected) {
        pendingActivePresetProfile = selected;
      }
    }

    async function refreshPresetProfiles(options = {}) {
      const silent = !!options.silent;
      const previous = presetProfileSelectEl ? presetProfileSelectEl.value : "";
      const preferred = String(previous || pendingActivePresetProfile || localStorage.getItem(ACTIVE_PRESET_PROFILE_STORAGE_KEY) || "").trim();
      try {
        const res = await fetch("/api/events/profiles");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || (currentLang === "id" ? "gagal memuat daftar profile preset" : "failed to load preset profiles"));
        presetProfiles = Array.isArray(data.items) ? data.items : [];
        renderPresetProfileOptions(preferred);
      } catch (err) {
        presetProfiles = [];
        renderPresetProfileOptions("");
        if (!silent) {
          setStatus(err.message || (currentLang === "id" ? "gagal memuat daftar profile preset" : "failed to load preset profiles"), false);
        }
      }
    }

    function resolveGiftImageLocal(gift) {
      if (!gift) return "";
      const imagePath = String(gift.image_path || "").trim();
      if (!imagePath) return "";
      const cleanPath = "/" + imagePath.replace(/^[/\\]+/, "").replaceAll("\\", "/");
      return cleanPath + (cleanPath.includes("?") ? "&" : "?") + "v=" + encodeURIComponent(String(giftImageVersion));
    }

    function resolveGiftImageRemote(gift) {
      if (!gift) return "";
      return String(gift.image_url || "").trim();
    }

    function resolveGiftImageSrc(gift) {
      return resolveGiftImageLocal(gift) || resolveGiftImageRemote(gift);
    }

    function createGiftThumb(src, alt, fallbackSrc) {
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
        const nextSrc = String(fallbackSrc || "").trim();
        if (nextSrc && img.dataset.fallbackTried !== "1") {
          img.dataset.fallbackTried = "1";
          img.src = nextSrc;
          return;
        }
        img.replaceWith(createGiftThumb("", alt));
      });
      return img;
    }

    function isExclusiveGift(gift) {
      if (!gift || typeof gift !== "object") return false;
      return !!gift.is_exclusive || Number(gift.type || 0) >= 2;
    }

    function fillGiftSelect(selectEl, items) {
      selectEl.innerHTML = "<option value=\"\">" + esc(t("ui.selectGift")) + "</option>";
      for (const g of items || []) {
        const opt = document.createElement("option");
        opt.value = String(g.id);
        opt.textContent = g.nama_gift + " (" + g.diamond + ")";
        selectEl.appendChild(opt);
      }
    }

    function sortEventItems(items) {
      return [...items].sort((a, b) => {
        const aDiamond = Number(a.diamond);
        const bDiamond = Number(b.diamond);
        const aValid = Number.isFinite(aDiamond);
        const bValid = Number.isFinite(bDiamond);
        if (aValid !== bValid) return aValid ? -1 : 1;
        if (aValid && bValid && aDiamond !== bDiamond) return aDiamond - bDiamond;

        const aTitle = String(a.title || "").trim().toLowerCase();
        const bTitle = String(b.title || "").trim().toLowerCase();
        if (aTitle !== bTitle) return aTitle.localeCompare(bTitle);

        return Number(b.id || 0) - Number(a.id || 0);
      });
    }

    function findGiftByEventItem(item) {
      const giftId = Number(item && item.gift_id ? item.gift_id : 0);
      if (!giftId) return null;
      return giftOptions.find((g) => Number(g.id) === giftId) || null;
    }

    function getUsedGiftIds(excludeEventId) {
      const used = new Set();
      for (const item of currentEventItems || []) {
        if (String(item.type || "").toLowerCase() !== "gift") continue;
        if (excludeEventId !== null && excludeEventId !== undefined && Number(item.id) === Number(excludeEventId)) continue;
        const giftId = Number(item.gift_id || 0);
        if (giftId > 0) used.add(giftId);
      }
      return used;
    }

    function refreshEventGiftOptions() {
      const usedGiftIds = getUsedGiftIds(editingEventId);
      const filtered = giftOptions.filter((g) => !usedGiftIds.has(Number(g.id)));
      fillGiftSelect(eventGiftEl, filtered);
      eventGiftPicker.setOptions(filtered);

      if (editingEventId !== null) {
        const currentItem = (currentEventItems || []).find((item) => Number(item.id) === Number(editingEventId));
        if (currentItem && Number(currentItem.gift_id || 0) > 0) {
          eventGiftEl.value = String(currentItem.gift_id);
        }
      }

      eventGiftPicker.syncFromSelect();
    }

    function refreshShortcutOptions() {
      eventShortcutPicker.setOptions(shortcutOptions);

      if (editingEventId !== null) {
        const currentItem = (currentEventItems || []).find((item) => Number(item.id) === Number(editingEventId));
        if (currentItem && String(currentItem.shortcut_keys || "").trim()) {
          eventShortcutKeysEl.value = normalizeShortcutSymbols(currentItem.shortcut_keys);
        }
      }

      eventShortcutPicker.syncFromSelect();
    }

    function buildGiftImagePathFromEvent(item) {
      const diamond = Number(item && item.diamond ? item.diamond : 0);
      const giftName = String(item && item.gift_name ? item.gift_name : "").trim();
      if (!giftName) return "";
      const filename = String(diamond) + "_" + giftName + ".webp";
      return "/giftimage/" + encodeURIComponent(filename);
    }

    function buildGiftBoxCaption(item) {
      const title = String(item && item.title ? item.title : "").trim();
      if (title) return title;
      return String(item && item.gift_name ? item.gift_name : "Gift");
    }

    function normalizeEventType(type) {
      const value = String(type || "").trim().toLowerCase();
      if (value === "user_follow") return "follow";
      if (value === "user_share") return "share";
      return value;
    }

    function getEventTypeCardLabel(type) {
      const normalized = normalizeEventType(type);
      if (normalized === "gift") return "GIFT";
      if (normalized === "like") return "LIKE";
      if (normalized === "follow") return "FOLLOW";
      if (normalized === "share") return "SHARE";
      return normalized ? normalized.toUpperCase() : "EVENT";
    }

    function getEventTypeIconClass(type) {
      const normalized = normalizeEventType(type);
      if (normalized === "like") return "fa-heart event-fa-like";
      if (normalized === "follow") return "fa-user-plus event-fa-follow";
      if (normalized === "share") return "fa-share-nodes event-fa-share";
      return "fa-bolt event-fa-default";
    }

    function splitGiftSubtitleFirstLine(text, firstLineMaxChars = 8) {
      const src = String(text || "").trim();
      if (!src) return "";

      const words = src.split(/\s+/).filter(Boolean);
      if (words.length <= 1) {
        return src;
      }

      let line1 = "";
      let usedWords = 0;
      for (let i = 0; i < words.length; i++) {
        const word = words[i];
        const candidate = line1 ? (line1 + " " + word) : word;
        if (candidate.length <= firstLineMaxChars || line1.length === 0) {
          line1 = candidate;
          usedWords = i + 1;
          if (candidate.length >= firstLineMaxChars) break;
          continue;
        }
        break;
      }

      if (usedWords >= words.length) {
        return src;
      }
      const line2 = words.slice(usedWords).join(" ");
      return line1 + "\n" + line2;
    }

    function splitGiftSubtitleToTwoBalancedLines(text) {
      const src = String(text || "").trim();
      if (!src) return "";
      const words = src.split(/\s+/).filter(Boolean);
      if (words.length <= 1) return src;

      const totalChars = words.join(" ").length;
      const target = Math.ceil(totalChars / 2);
      let line1 = "";
      let used = 0;

      for (let i = 0; i < words.length; i++) {
        const candidate = line1 ? (line1 + " " + words[i]) : words[i];
        const remainingWords = words.length - (i + 1);
        line1 = candidate;
        used = i + 1;
        if (candidate.length >= target && remainingWords > 0) break;
      }

      if (used >= words.length) return src;
      const line2 = words.slice(used).join(" ");
      return line1 + "\n" + line2;
    }

    function getGiftSubtitleFontSize(columns) {
      const safeColumns = normalizeEventBoxColumns(columns);
      return getEventBoxScaleProfile(safeColumns).font;
    }

    const EVENT_BOX_BASE_WIDTH = 1920;
    const EVENT_BOX_BASE_HEIGHT = 1080;

    function getEventBoxSlideLayoutScale(slideEl) {
      if (!slideEl) return 1;
      const rect = slideEl.getBoundingClientRect();
      if (!rect || rect.width <= 0 || rect.height <= 0) return 1;

      const widthScale = rect.width / EVENT_BOX_BASE_WIDTH;
      const heightScale = rect.height / EVENT_BOX_BASE_HEIGHT;
      return Math.max(0.45, Math.min(1, Math.min(widthScale, heightScale)));
    }

    function getGiftSubtitleLayoutScale(el) {
      const exportCanvas = el && el.closest ? el.closest(".event-export-canvas") : null;
      if (exportCanvas) {
        const forcedPreviewScale = Number(getComputedStyle(exportCanvas).getPropertyValue("--event-box-preview-scale").trim());
        if (Number.isFinite(forcedPreviewScale) && forcedPreviewScale > 0) {
          return Math.max(0.45, Math.min(1, forcedPreviewScale));
        }
      }
      const slideEl = el && el.closest ? el.closest(".event-box-slide") : null;
      return getEventBoxSlideLayoutScale(slideEl);
    }

    function getEventBoxPreviewScale() {
      if (!eventBoxRowsEl) return 1;
      const slideEl = eventBoxRowsEl.querySelector(".event-box-slide");
      return getEventBoxSlideLayoutScale(slideEl);
    }

    function getEventBoxColumnsFromElement(el) {
      if (!el) return getDefaultEventBoxColumns();
      const rawColumns = getComputedStyle(el).getPropertyValue("--event-box-columns").trim();
      return normalizeEventBoxColumns(rawColumns);
    }

    function fitGiftSubtitle(el) {
      if (!el) return;
      const columns = getEventBoxColumnsFromElement(el);
      const originalInlineFontSize = el.style.fontSize;
      const originalInlineLetterSpacing = el.style.letterSpacing;
      if (originalInlineFontSize) {
        el.style.fontSize = "";
      }
      if (originalInlineLetterSpacing) {
        el.style.letterSpacing = "";
      }
      const cssFontSize = parseFloat(getComputedStyle(el).fontSize);
      const cssLetterSpacing = parseFloat(getComputedStyle(el).letterSpacing);
      if (originalInlineFontSize) {
        el.style.fontSize = originalInlineFontSize;
      }
      if (originalInlineLetterSpacing) {
        el.style.letterSpacing = originalInlineLetterSpacing;
      }
      const cssBaseFontSize = Number.isFinite(cssFontSize) && cssFontSize > 0
        ? cssFontSize
        : 28;
      const baseProfileFont = getGiftSubtitleFontSize(getDefaultEventBoxColumns());
      const currentProfileFont = getGiftSubtitleFontSize(columns);
      const profileScale = (Number.isFinite(baseProfileFont) && baseProfileFont > 0)
        ? (currentProfileFont / baseProfileFont)
        : 1;
      const baseFontSize = cssBaseFontSize * profileScale;
      const baseLetterSpacing = Number.isFinite(cssLetterSpacing)
        ? (cssLetterSpacing * profileScale)
        : 0.25;
      el.style.fontSize = baseFontSize.toFixed(1) + "px";
      el.style.letterSpacing = baseLetterSpacing.toFixed(3) + "px";
      el.title = "";
    }

    function fitGiftSubtitles(rootEl) {
      if (!rootEl) return Promise.resolve();
      return new Promise((resolve) => {
        requestAnimationFrame(() => {
          for (const el of rootEl.querySelectorAll(".event-card-gift-subtitle")) {
            fitGiftSubtitle(el);
          }
          resolve();
        });
      });
    }

    function waitForImageLoad(img) {
      return new Promise((resolve) => {
        if (!img) {
          resolve();
          return;
        }
        if (img.complete) {
          resolve();
          return;
        }
        const done = () => resolve();
        img.addEventListener("load", done, { once: true });
        img.addEventListener("error", done, { once: true });
      });
    }

    async function waitForImagesIn(rootEl) {
      if (!rootEl) return;
      const images = Array.from(rootEl.querySelectorAll("img"));
      await Promise.all(images.map(waitForImageLoad));
    }

    function buildEventExportFileName(index) {
      const safeIndex = Math.max(1, Number(index) || 1);
      return "event-list-box-slide-" + String(safeIndex).padStart(2, "0") + ".png";
    }

    async function exportEventBoxSlidesAsPNG() {
      if (!window.html2canvas) {
        setStatus(currentLang === "id" ? "html2canvas gagal dimuat" : "html2canvas failed to load", false);
        return;
      }
      if (!eventBoxRowsEl) {
        setStatus(currentLang === "id" ? "ekspor event tidak tersedia" : "event export is not available", false);
        return;
      }
      const slides = Array.from(eventBoxRowsEl.querySelectorAll(".event-box-slide"));
      if (slides.length === 0) {
        setStatus(currentLang === "id" ? "tidak ada slide event untuk diekspor" : "no event slides to export", false);
        return;
      }
      const previewWindowEl = eventBoxRowsEl.closest(".event-slider-window");
      if (!previewWindowEl) {
        setStatus(currentLang === "id" ? "preview event tidak ditemukan" : "event preview not found", false);
        return;
      }

      stopEventSlider();
      if (exportEventBoxBtn) {
        exportEventBoxBtn.disabled = true;
      }
      const originalEventPage = currentEventPage;

      try {
        previewWindowEl.classList.add("is-exporting-clean");
        await fitGiftSubtitles(eventBoxRowsEl);
        await new Promise((resolve) => requestAnimationFrame(() => resolve()));
        if (document.fonts && typeof document.fonts.ready === "object") {
          await document.fonts.ready;
        }
        for (let i = 0; i < slides.length; i++) {
          currentEventPage = i;
          updateEventSliderPosition(slides.length);
          await waitForImagesIn(previewWindowEl);
          await fitGiftSubtitles(eventBoxRowsEl);
          if (document.fonts && typeof document.fonts.ready === "object") {
            await document.fonts.ready;
          }
          await new Promise((resolve) => requestAnimationFrame(() => resolve()));

          const slideRect = slides[i].getBoundingClientRect();
          const captureWidth = Math.max(
            1,
            Math.round(Math.max(slides[i].scrollWidth || 0, slides[i].clientWidth || 0, slideRect && slideRect.width ? slideRect.width : 0))
          );
          const captureHeight = Math.max(
            1,
            Math.round(Math.max(slides[i].scrollHeight || 0, slides[i].clientHeight || 0, slideRect && slideRect.height ? slideRect.height : 0))
          );
          const renderedCanvas = await window.html2canvas(previewWindowEl, {
            backgroundColor: null,
            width: captureWidth,
            height: captureHeight,
            scale: 2,
            useCORS: true,
            logging: false
          });

          const link = document.createElement("a");
          link.href = renderedCanvas.toDataURL("image/png");
          link.download = buildEventExportFileName(i + 1);
          document.body.appendChild(link);
          link.click();
          link.remove();
        }
        setStatus(currentLang === "id" ? "slide event berhasil disimpan sebagai PNG" : "event slides saved as PNG successfully", true);
      } catch (err) {
        setStatus((err && err.message) || (currentLang === "id" ? "gagal menyimpan slide event" : "failed to save event slides"), false);
      } finally {
        previewWindowEl.classList.remove("is-exporting-clean");
        currentEventPage = Math.max(0, Math.min(originalEventPage, Math.max(0, slides.length - 1)));
        updateEventSliderPosition(slides.length);
        if (exportEventBoxBtn) {
          exportEventBoxBtn.disabled = false;
        }
        startEventSlider(slides.length);
      }
    }

    function getDefaultEventBoxColumns() {
      return 5;
    }

    function normalizeEventBoxColumns(value, fallback = getDefaultEventBoxColumns()) {
      const parsed = Number(value);
      if (!Number.isFinite(parsed)) return fallback;
      return Math.max(5, Math.min(10, Math.round(parsed)));
    }

    function getEventBoxImageSize(columns) {
      const safeColumns = normalizeEventBoxColumns(columns);
      return getEventBoxScaleProfile(safeColumns).image;
    }

    function getEventBoxSubtitleHeight(columns) {
      const safeColumns = normalizeEventBoxColumns(columns);
      return getEventBoxScaleProfile(safeColumns).subtitle;
    }

    function getEventBoxSubtitleSingleHeight(columns) {
      const safeColumns = normalizeEventBoxColumns(columns);
      return getEventBoxScaleProfile(safeColumns).subtitleSingle;
    }

    function getEventBoxScaleProfile(columns) {
      const safeColumns = normalizeEventBoxColumns(columns);
      const table = {
        5: { font: 34, image: 108, subtitle: 66, subtitleSingle: 40 },
        6: { font: 30, image: 96, subtitle: 62, subtitleSingle: 38 },
        7: { font: 27, image: 96, subtitle: 58, subtitleSingle: 36 },
        8: { font: 24, image: 88, subtitle: 54, subtitleSingle: 34 },
        9: { font: 22, image: 80, subtitle: 52, subtitleSingle: 33 },
        10: { font: 20, image: 74, subtitle: 50, subtitleSingle: 32 }
      };
      return table[safeColumns] || table[7];
    }

    function applyEventRowTextLayout(rootEl) {
      if (!rootEl) return;
      const measureSingleLineWidth = (subtitleEl) => {
        const text = String(subtitleEl.textContent || "").replace(/\s+/g, " ").trim();
        if (!text) return 0;
        const style = getComputedStyle(subtitleEl);
        const probe = document.createElement("span");
        probe.textContent = text;
        probe.style.position = "absolute";
        probe.style.visibility = "hidden";
        probe.style.pointerEvents = "none";
        probe.style.whiteSpace = "nowrap";
        probe.style.fontFamily = style.fontFamily;
        probe.style.fontSize = style.fontSize;
        probe.style.fontWeight = style.fontWeight;
        probe.style.fontStyle = style.fontStyle;
        probe.style.letterSpacing = style.letterSpacing;
        probe.style.textTransform = style.textTransform;
        document.body.appendChild(probe);
        const width = probe.getBoundingClientRect().width;
        probe.remove();
        return width;
      };

      for (const slide of rootEl.querySelectorAll(".event-box-slide")) {
        const cards = Array.from(slide.children).filter((card) => !card.classList.contains("event-card-empty"));
        for (const card of cards) {
          const subtitle = card.querySelector(".event-card-gift-subtitle");
          if (!subtitle) continue;
          fitGiftSubtitle(subtitle);
          card.classList.remove("event-row-singleline", "event-row-mixed");
          subtitle.classList.remove("is-singleline-center", "is-wrap");
          const subtitleStyle = getComputedStyle(subtitle);
          const paddingX = (parseFloat(subtitleStyle.paddingLeft) || 0) + (parseFloat(subtitleStyle.paddingRight) || 0);
          const availableWidth = Math.max(0, subtitle.clientWidth - paddingX);
          const textWidth = measureSingleLineWidth(subtitle);
          const isWrapped = availableWidth > 0 ? (textWidth > (availableWidth + 0.5)) : false;
          if (isWrapped) {
            subtitle.classList.add("is-wrap");
          } else {
            card.classList.add("event-row-singleline");
          }
        }
      }
    }

    function applyEventBoxColumns(columns) {
      const safeColumns = normalizeEventBoxColumns(columns);
      const imageSize = getEventBoxImageSize(safeColumns) + "px";
      const subtitleHeight = getEventBoxSubtitleHeight(safeColumns) + "px";
      const subtitleSingleHeight = getEventBoxSubtitleSingleHeight(safeColumns) + "px";
      if (eventBoxPerRowEl) {
        eventBoxPerRowEl.value = String(safeColumns);
      }
      if (eventBoxRowsEl) {
        eventBoxRowsEl.style.setProperty("--event-box-columns", String(safeColumns));
        eventBoxRowsEl.style.setProperty("--event-box-image-size", imageSize);
        eventBoxRowsEl.style.setProperty("--event-box-subtitle-height", subtitleHeight);
        eventBoxRowsEl.style.setProperty("--event-box-subtitle-height-single", subtitleSingleHeight);
      }
      if (eventBoxRowsPopupEl) {
        eventBoxRowsPopupEl.style.setProperty("--event-box-columns", String(safeColumns));
        eventBoxRowsPopupEl.style.setProperty("--event-box-image-size", imageSize);
        eventBoxRowsPopupEl.style.setProperty("--event-box-subtitle-height", subtitleHeight);
        eventBoxRowsPopupEl.style.setProperty("--event-box-subtitle-height-single", subtitleSingleHeight);
      }
      return safeColumns;
    }

    function getEventBoxColumns() {
      if (eventBoxPerRowEl) {
        return normalizeEventBoxColumns(eventBoxPerRowEl.value);
      }
      return getDefaultEventBoxColumns();
    }

    function getEventBoxRows() {
      return 4;
    }

    function getEventBoxVisibleSize() {
      return getEventBoxColumns() * getEventBoxRows();
    }

    function stopEventSlider() {
      if (!eventSliderTimer) return;
      clearInterval(eventSliderTimer);
      eventSliderTimer = null;
    }

    function resetEventLoopPosition(targetEl) {
      if (!targetEl) return;
      targetEl.style.transform = "translateX(0px)";
    }

    function getEventPageCount() {
      if (!eventBoxRowsEl) return 0;
      return eventBoxRowsEl.querySelectorAll(".event-box-slide").length;
    }

    function syncEventSlideButtons(pageCount) {
      const disabled = (Number(pageCount) || 0) <= 1;
      if (eventPrevSlideBtn) eventPrevSlideBtn.disabled = disabled;
      if (eventNextSlideBtn) eventNextSlideBtn.disabled = disabled;
    }

    function updateEventSliderPosition(pageCount) {
      if (!eventBoxRowsEl) return;
      const safePageCount = Math.max(1, Number(pageCount) || 1);
      currentEventPage = ((currentEventPage % safePageCount) + safePageCount) % safePageCount;
      eventBoxRowsEl.style.transform = "translateX(-" + (currentEventPage * 100) + "%)";
      syncEventSlideButtons(safePageCount);
    }

    function startEventSlider(pageCount) {
      stopEventSlider();
      if (!eventBoxRowsEl || pageCount <= 1) return;
      eventSliderTimer = setInterval(() => {
        currentEventPage = (currentEventPage + 1) % pageCount;
        updateEventSliderPosition(pageCount);
      }, EVENT_SLIDE_INTERVAL_MS);
    }

    function setupEventLoop(pageCount) {
      stopEventSlider();
      currentEventPage = 0;
      resetEventLoopPosition(eventBoxRowsEl);
      fitGiftSubtitles(eventBoxRowsEl);
      updateEventSliderPosition(pageCount);
      startEventSlider(pageCount);
      syncEventBoxPopup();
    }

    function moveEventSlide(delta) {
      const pageCount = getEventPageCount();
      if (pageCount <= 1) {
        syncEventSlideButtons(pageCount);
        return;
      }
      const step = Number(delta) || 0;
      currentEventPage = (currentEventPage + step + pageCount) % pageCount;
      updateEventSliderPosition(pageCount);
      startEventSlider(pageCount);
    }

    if (eventBoxRowsEl) {
      eventBoxRowsEl.addEventListener("mouseenter", () => {
        stopEventSlider();
      });
      eventBoxRowsEl.addEventListener("mouseleave", () => {
        const pageCount = getEventPageCount();
        startEventSlider(pageCount);
      });
    }

    if (eventPrevSlideBtn) {
      eventPrevSlideBtn.addEventListener("click", () => {
        moveEventSlide(-1);
      });
    }

    if (eventNextSlideBtn) {
      eventNextSlideBtn.addEventListener("click", () => {
        moveEventSlide(1);
      });
    }

    window.addEventListener("resize", () => {
      renderEventBoxes(currentEventItems);
    });

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

      let currentPlaceholder = placeholder;
      const search = document.createElement("input");
      search.type = "search";
      search.className = "gift-picker-search";
      search.placeholder = t("ui.searchGift");

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
          copy.innerHTML = "<span class=\"gift-picker-name\">" + esc(currentPlaceholder) + "</span>";
          selectedWrap.appendChild(createGiftThumb("", ""));
          selectedWrap.appendChild(copy);
          return;
        }

        const copy = document.createElement("span");
        copy.className = "gift-picker-copy";
        copy.innerHTML = "<span class=\"gift-picker-name\">" + esc(selected.nama_gift) + "</span>";
        const localImage = resolveGiftImageLocal(selected);
        const remoteImage = resolveGiftImageRemote(selected);
        selectedWrap.appendChild(createGiftThumb(localImage || remoteImage, selected.nama_gift || "Gift", localImage ? remoteImage : ""));
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
          empty.textContent = t("ui.giftNotFound");
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
          const localImage = resolveGiftImageLocal(g);
          const remoteImage = resolveGiftImageRemote(g);
          option.appendChild(createGiftThumb(localImage || remoteImage, g.nama_gift || "Gift", localImage ? remoteImage : ""));
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
          search.placeholder = t("ui.searchGift");
          renderSelected();
          renderList();
        },
        setPlaceholder(value) {
          currentPlaceholder = String(value || "");
          search.placeholder = t("ui.searchGift");
          renderSelected();
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

    function createShortcutPicker(selectEl, hostEl, placeholder, cfg = {}) {
      const withSearch = cfg.withSearch !== false;
      let currentPlaceholder = placeholder;
      const root = document.createElement("div");
      root.className = "gift-picker";
      root.classList.add("shortcut-picker");

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
      search.placeholder = t("ui.searchShortcut");

      const list = document.createElement("div");
      list.className = "gift-picker-list";
      list.setAttribute("role", "listbox");

      if (withSearch) {
        menu.appendChild(search);
      }
      menu.appendChild(list);
      toggle.appendChild(selectedWrap);
      root.appendChild(toggle);
      root.appendChild(menu);
      hostEl.appendChild(root);

      let options = [];

      function normalizeOption(item) {
        if (typeof item === "string") {
          const text = String(item || "").trim();
          return { value: text, label: text };
        }
        if (item && typeof item === "object") {
          const value = String(item.value ?? item.id ?? "").trim();
          const label = String(item.label ?? item.title ?? item.name ?? value).trim();
          return { value, label: label || value };
        }
        return { value: "", label: "" };
      }

      function renderSelected() {
        const selected = String(selectEl.value || "").trim();
        selectedWrap.innerHTML = "";
        const selectedOption = options.find((item) => String(item.value) === selected);
        const copy = document.createElement("span");
        copy.className = "gift-picker-copy";
        const selectedLabel = selectedOption ? selectedOption.label : selected;
        copy.innerHTML = "<span class=\"gift-picker-name\">" + esc(selectedLabel || currentPlaceholder) + "</span>";
        selectedWrap.appendChild(copy);
      }

      function renderList() {
        const query = withSearch ? String(search.value || "").trim().toLowerCase() : "";
        list.innerHTML = "";
        const filtered = options.filter((item) => {
          if (!query) return true;
          return String(item.label || "").toLowerCase().includes(query) ||
            String(item.value || "").toLowerCase().includes(query);
        });

        if (filtered.length === 0) {
          const empty = document.createElement("div");
          empty.className = "gift-picker-empty";
          empty.textContent = t("ui.shortcutNotFound");
          list.appendChild(empty);
          return;
        }

        for (const item of filtered) {
          const option = document.createElement("button");
          option.type = "button";
          option.className = "gift-picker-option";
          if (String(item.value) === String(selectEl.value || "")) {
            option.classList.add("is-selected");
          }
          const copy = document.createElement("span");
          copy.className = "gift-picker-option-copy";
          copy.innerHTML = "<span class=\"gift-picker-name\">" + esc(item.label) + "</span>";
          option.appendChild(copy);
          option.addEventListener("click", () => {
            selectEl.value = String(item.value);
            renderSelected();
            renderList();
            closeMenu();
            selectEl.dispatchEvent(new Event("change", { bubbles: true }));
          });
          list.appendChild(option);
        }
      }

      function openMenu() {
        menu.hidden = false;
        toggle.setAttribute("aria-expanded", "true");
        renderList();
        if (withSearch) {
          requestAnimationFrame(() => search.focus());
        }
      }

      function closeMenu() {
        menu.hidden = true;
        toggle.setAttribute("aria-expanded", "false");
      }

      toggle.addEventListener("click", () => {
        if (menu.hidden) openMenu();
        else closeMenu();
      });

      if (withSearch) {
        search.addEventListener("input", renderList);
      }
      document.addEventListener("click", (e) => {
        if (!root.contains(e.target)) {
          closeMenu();
        }
      });

      return {
        setOptions(items) {
          const prevValue = String(selectEl.value || "").trim();
          options = (Array.isArray(items) ? items : []).map(normalizeOption).filter((item) => String(item.value || "").trim() !== "");
          selectEl.innerHTML = "<option value=\"\"></option>";
          for (const item of options) {
            const opt = document.createElement("option");
            opt.value = String(item.value);
            opt.textContent = String(item.label || item.value);
            selectEl.appendChild(opt);
          }
          if (prevValue && options.some((item) => String(item.value) === prevValue)) {
            selectEl.value = prevValue;
          } else if (selectEl.value && !options.some((item) => String(item.value) === String(selectEl.value))) {
            selectEl.value = "";
          }
          if (withSearch) {
            search.value = "";
            search.placeholder = t("ui.searchShortcut");
          }
          renderSelected();
          renderList();
        },
        setPlaceholder(value) {
          currentPlaceholder = String(value || "");
          if (withSearch) search.placeholder = t("ui.searchShortcut");
          renderSelected();
        },
        setDisabled(disabled) {
          toggle.disabled = !!disabled;
          root.classList.toggle("disabled", !!disabled);
          if (disabled) closeMenu();
        },
        syncFromSelect() {
          renderSelected();
          renderList();
        }
      };
    }

    const eventGiftPicker = createGiftPicker(eventGiftEl, eventGiftPickerHostEl, t("ui.selectGift"));
    const testEventGiftPicker = createGiftPicker(testEventGiftEl, testEventGiftPickerHostEl, t("ui.selectGift"));
    const eventShortcutPicker = createShortcutPicker(eventShortcutKeysEl, eventShortcutPickerHostEl, t("ui.selectShortcut"));
    const likeGoalModePicker = createShortcutPicker(likeGoalModeEl, likeGoalModePickerHostEl, t("ui.selectMode"), { withSearch: false });
    const likeGoalTriggerPicker = createShortcutPicker(likeGoalTriggerEventEl, likeGoalTriggerEventPickerHostEl, t("ui.likeGoalSelectTrigger"));
    eventShortcutPicker.setOptions(shortcutOptions);
    likeGoalModePicker.setOptions([
      { value: "increase", label: "increase" },
      { value: "double", label: "double" }
    ]);
    likeGoalModePicker.syncFromSelect();

    function initLanguageMode() {
      const saved = String(localStorage.getItem(I18N_STORAGE_KEY) || "").toLowerCase();
      if (saved === "id" || saved === "en") {
        currentLang = saved;
      } else {
        currentLang = String(navigator.language || "").toLowerCase().startsWith("id") ? "id" : "en";
      }
      applyLanguageUI();
    }

    function ensureTriggerAudioContext() {
      if (triggerAudioCtx) return triggerAudioCtx;
      const AudioCtx = window.AudioContext || window.webkitAudioContext;
      if (!AudioCtx) return null;
      try {
        triggerAudioCtx = new AudioCtx();
        triggerAudioGain = triggerAudioCtx.createGain();
        triggerAudioGain.gain.value = 1;
        triggerAudioGain.connect(triggerAudioCtx.destination);
      } catch (_) {
        triggerAudioCtx = null;
        triggerAudioGain = null;
      }
      return triggerAudioCtx;
    }

    async function unlockTriggerAudio() {
      if (triggerAudioUnlocked) return true;
      const ctx = ensureTriggerAudioContext();
      if (!ctx) {
        triggerAudioUnlocked = true;
        return true;
      }
      try {
        if (ctx.state !== "running") {
          await ctx.resume();
        }
        const silent = ctx.createBuffer(1, 1, 22050);
        const source = ctx.createBufferSource();
        source.buffer = silent;
        source.connect(triggerAudioGain || ctx.destination);
        source.start(0);
        triggerAudioUnlocked = true;
        return true;
      } catch (_) {
        return false;
      }
    }

    async function playTriggerSound(soundURL) {
      const url = normalizeSoundURL(soundURL);
      if (!url) return;
      try {
        await unlockTriggerAudio();
      } catch (_) {
      }

      const ctx = ensureTriggerAudioContext();
      if (ctx && (ctx.state === "running" || triggerAudioUnlocked)) {
        try {
          let buf = triggerAudioBufferCache.get(url);
          if (!buf) {
            const res = await fetch(url, { cache: "no-store" });
            if (!res.ok) throw new Error("sound fetch failed");
            const arr = await res.arrayBuffer();
            buf = await ctx.decodeAudioData(arr.slice(0));
            triggerAudioBufferCache.set(url, buf);
          }
          const source = ctx.createBufferSource();
          source.buffer = buf;
          source.connect(triggerAudioGain || ctx.destination);
          source.start(0);
          return;
        } catch (_) {
        }
      }

      const audio = new Audio(url);
      audio.preload = "auto";
      audio.muted = false;
      audio.volume = 1;
      audio.setAttribute("playsinline", "");
      activeTriggerAudios.add(audio);
      const cleanup = () => {
        activeTriggerAudios.delete(audio);
      };
      audio.addEventListener("ended", cleanup, { once: true });
      audio.addEventListener("error", cleanup, { once: true });
      audio.play().catch(() => {
        cleanup();
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
      if (state === true) return "<span class=\"ev-badge follow\">" + esc(currentLang === "id" ? "MENGIKUTI" : "FOLLOW") + "</span>";
      if (state === false) return "<span class=\"ev-badge nofollow\">" + esc(currentLang === "id" ? "BELUM FOLLOW" : "NOT FOLLOWING") + "</span>";
      return "";
    }

    function formatHistoryItem(payload) {
      if (!payload) {
        return { html: "<span class=\"ev-badge system\">SYSTEM</span><span class=\"ev-text\">" + esc(currentLang === "id" ? "Event kosong" : "Empty event") + "</span>" };
      }

      if (payload.type === "error") {
        return {
          html: "<span class=\"ev-badge error\">ERROR</span><span class=\"ev-text\">" + esc(translateKnownMessage(payload.error || (currentLang === "id" ? "error tidak diketahui" : "unknown error"))) + "</span>"
        };
      }

      if (payload.type === "status") {
        return {
          html: "<span class=\"ev-badge system\">SYSTEM</span><span class=\"ev-text\">" + esc(translateKnownMessage(payload.message || "")) + "</span>"
        };
      }

      if (payload.type === "trigger") {
        const eventType = String(payload.event_type || "").toLowerCase();
        const username = payload.username || "Unknown";
        const ruleId = payload.event_id ?? "?";
        const giftName = payload.gift_name || "Gift";
        const repeatCount = Math.max(1, Number(payload.repeatcount || 1));
        let detail = (currentLang === "id" ? "event #" : "event #") + esc(ruleId);

        if (eventType === "gift") {
          detail = (currentLang === "id" ? "trigger gift " : "gift trigger ") + esc(giftName) + " x" + esc(repeatCount) + " -> event #" + esc(ruleId);
        } else if (eventType) {
          detail = esc(eventType) + (currentLang === "id" ? " trigger -> event #" : " trigger -> event #") + esc(ruleId);
        }

        return {
          html: "<span class=\"ev-user\">" + esc(username) + "</span><span class=\"ev-badge system\">TRIGGER</span><span class=\"ev-text\">" + detail + "</span>"
        };
      }

      if (payload.type === "like_goal_state") {
        const state = payload.state || {};
        const title = String(state.title || "Like Goal");
        const currentLikes = Math.max(0, Number(state.current_likes || 0));
        const currentGoal = Math.max(1, Number(state.current_goal || state.goal || 1));
        return {
          html: "<span class=\"ev-badge like\">LIKE GOAL</span><span class=\"ev-text\">" + esc(title) + "</span><span class=\"ev-meta\">" + esc(currentLikes) + " / " + esc(currentGoal) + "</span>"
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
              html: "<span class=\"ev-user\">" + esc(username) + "</span><span class=\"ev-badge join\">" + esc(currentLang === "id" ? "MASUK LIVE" : "JOIN LIVE") + "</span>" + followBadge
            };
          }
          if (tag.includes("FOLLOW")) {
            return {
              html: "<span class=\"ev-user\">" + esc(username) + "</span><span class=\"ev-badge follow\">FOLLOW</span>" + followBadge
            };
          }
          if (tag.includes("SHARE")) {
            return {
              html: "<span class=\"ev-user\">" + esc(username) + "</span><span class=\"ev-badge share\">" + esc(currentLang === "id" ? "BAGIKAN LIVE" : "SHARE LIVE") + "</span>" + followBadge
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
            html: "<span class=\"ev-user\">" + esc(username) + "</span><span class=\"ev-badge like\">LIKE</span>" + followBadge + "<span class=\"ev-meta\">" + esc(likes) + (currentLang === "id" ? " like" : " likes") + "</span>"
          };
        }

        if (eventType.includes("GiftEvent")) {
          const giftName = data.name || data.Name || "Gift";
          const diamond = data.diamonds ?? data.Diamonds ?? 0;
          const repeatCount = Math.max(1, Number(data.repeatCount ?? data.RepeatCount ?? 1));
          const totalDiamonds = Number(diamond) * repeatCount;
          return {
            html: "<span class=\"ev-user\">" + esc(username) + "</span><span class=\"ev-badge gift\">GIFT</span>" + followBadge + "<span class=\"ev-text\">" + esc(giftName) + "</span><span class=\"ev-meta\">x" + esc(repeatCount) + " | " + esc(diamond) + (currentLang === "id" ? " diamond per gift | total " : " diamonds each | total ") + esc(totalDiamonds) + "</span>"
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
            html: "<span class=\"ev-badge viewers\">VIEWERS</span><span class=\"ev-meta\">" + esc(viewers) + (currentLang === "id" ? " menonton" : " watching") + "</span>"
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
            html: "<span class=\"ev-badge battle\">MIC BATTLE</span><span class=\"ev-meta\">" + esc(count) + (currentLang === "id" ? " user" : " users") + "</span>"
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
            html: "<span class=\"ev-badge banner\">ROOM BANNER</span><span class=\"ev-text\">" + esc(currentLang === "id" ? "Pembaruan banner" : "Banner update") + "</span>"
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
      const message = translateKnownMessage(text || "");
      mcOutputEl.textContent = message;
      showFloatingToast(message, detectToastType(message), TOAST_DURATION_MS);
    }

    function resetEventForm() {
      editingEventId = null;
      eventForm.reset();
      eventTypeEl.value = "gift";
      eventTitleEl.value = "";
      eventSoundEl.value = "";
      eventRunMCCommandEl.checked = true;
      eventRunShortcutEl.checked = false;
      if (eventRepeatByGiftComboEl) {
        eventRepeatByGiftComboEl.checked = true;
      }
      if (eventShowInExportEl) {
        eventShowInExportEl.checked = true;
      }
      eventShortcutKeysEl.value = "";
      eventShortcutHoldMsEl.value = "0";
      eventShortcutPicker.syncFromSelect();
      eventModalTitleEl.textContent = t("ui.eventModalAdd");
      refreshEventGiftOptions();
      refreshShortcutOptions();
      syncGiftFields();
      syncExecutionModeFields();
      syncLabelHint();
      eventTypeEl.focus();
    }

    function openEventModal(isEdit) {
      eventModalTitleEl.textContent = isEdit ? t("ui.eventModalEdit") : t("ui.eventModalAdd");
      eventModalEl.classList.add("show");
      eventModalEl.setAttribute("aria-hidden", "false");
    }

    function closeEventModal() {
      eventModalEl.classList.remove("show");
      eventModalEl.setAttribute("aria-hidden", "true");
    }

    function openCreatePresetProfileModal() {
      if (!createPresetProfileModalEl) return;
      if (createPresetProfileNameEl) {
        createPresetProfileNameEl.value = "";
      }
      createPresetProfileModalEl.classList.add("show");
      createPresetProfileModalEl.setAttribute("aria-hidden", "false");
      if (createPresetProfileNameEl) {
        createPresetProfileNameEl.focus();
      }
    }

    function closeCreatePresetProfileModal() {
      if (!createPresetProfileModalEl) return;
      createPresetProfileModalEl.classList.remove("show");
      createPresetProfileModalEl.setAttribute("aria-hidden", "true");
    }

    function openRenamePresetProfileModal(currentProfileName) {
      if (!renamePresetProfileModalEl) return;
      const current = String(currentProfileName || "").trim();
      renamePresetSourceProfile = current;
      if (renamePresetProfileNameEl) {
        renamePresetProfileNameEl.value = current;
      }
      renamePresetProfileModalEl.classList.add("show");
      renamePresetProfileModalEl.setAttribute("aria-hidden", "false");
      if (renamePresetProfileNameEl) {
        renamePresetProfileNameEl.focus();
        renamePresetProfileNameEl.select();
      }
    }

    function closeRenamePresetProfileModal() {
      if (!renamePresetProfileModalEl) return;
      renamePresetProfileModalEl.classList.remove("show");
      renamePresetProfileModalEl.setAttribute("aria-hidden", "true");
      renamePresetSourceProfile = "";
    }

    function openHowToModal() {
      if (!howToModalEl) return;
      howToModalEl.classList.add("show");
      howToModalEl.setAttribute("aria-hidden", "false");
    }

    function closeHowToModal() {
      if (!howToModalEl) return;
      howToModalEl.classList.remove("show");
      howToModalEl.setAttribute("aria-hidden", "true");
    }

    function syncEventBoxPopup() {
      if (!eventBoxRowsPopupEl || !eventPaginationPopupEl) return;
      eventBoxRowsPopupEl.innerHTML = eventBoxRowsEl ? eventBoxRowsEl.innerHTML : "";
      eventPaginationPopupEl.innerHTML = eventPaginationEl ? eventPaginationEl.innerHTML : "";
      eventBoxRowsPopupEl.dataset.repeatCount = eventBoxRowsEl ? eventBoxRowsEl.dataset.repeatCount || "1" : "1";
      eventBoxRowsPopupEl.style.transform = eventBoxRowsEl ? eventBoxRowsEl.style.transform || "translateX(0px)" : "translateX(0px)";
      const eventBoxColumns = eventBoxRowsEl ? getComputedStyle(eventBoxRowsEl).getPropertyValue("--event-box-columns").trim() : "";
      const eventBoxImageSize = eventBoxRowsEl ? getComputedStyle(eventBoxRowsEl).getPropertyValue("--event-box-image-size").trim() : "";
      const eventBoxSubtitleHeight = eventBoxRowsEl ? getComputedStyle(eventBoxRowsEl).getPropertyValue("--event-box-subtitle-height").trim() : "";
      const eventBoxSubtitleSingleHeight = eventBoxRowsEl ? getComputedStyle(eventBoxRowsEl).getPropertyValue("--event-box-subtitle-height-single").trim() : "";
      if (eventBoxColumns) {
        eventBoxRowsPopupEl.style.setProperty("--event-box-columns", eventBoxColumns);
      }
      if (eventBoxImageSize) {
        eventBoxRowsPopupEl.style.setProperty("--event-box-image-size", eventBoxImageSize);
      }
      if (eventBoxSubtitleHeight) {
        eventBoxRowsPopupEl.style.setProperty("--event-box-subtitle-height", eventBoxSubtitleHeight);
      }
      if (eventBoxSubtitleSingleHeight) {
        eventBoxRowsPopupEl.style.setProperty("--event-box-subtitle-height-single", eventBoxSubtitleSingleHeight);
      }
      applyEventRowTextLayout(eventBoxRowsPopupEl);
      fitGiftSubtitles(eventBoxRowsPopupEl);
    }

    function openEventBoxModal() {
      if (!eventBoxModalEl) return;
      syncEventBoxPopup();
      eventBoxModalEl.classList.add("show");
      eventBoxModalEl.setAttribute("aria-hidden", "false");
    }

    function closeEventBoxModal() {
      if (!eventBoxModalEl) return;
      eventBoxModalEl.classList.remove("show");
      eventBoxModalEl.setAttribute("aria-hidden", "true");
    }

    function syncGiftFields() {
      const isGift = eventTypeEl.value === "gift";
      eventGiftEl.disabled = !isGift;
      eventGiftPickerHostEl.hidden = !isGift;
      eventGiftPickerHostEl.style.display = isGift ? "" : "none";
      eventGiftPicker.setDisabled(!isGift);
      if (eventRepeatByGiftComboWrapEl) {
        eventRepeatByGiftComboWrapEl.hidden = !isGift;
        eventRepeatByGiftComboWrapEl.style.display = isGift ? "" : "none";
      }
      if (!isGift) {
        eventGiftEl.value = "";
        if (eventRepeatByGiftComboEl) {
          eventRepeatByGiftComboEl.checked = false;
        }
        eventGiftPicker.syncFromSelect();
        return;
      }
      if (eventRepeatByGiftComboEl && !editingEventId) {
        eventRepeatByGiftComboEl.checked = true;
      }
      eventGiftPicker.syncFromSelect();
    }

    function syncExecutionModeFields() {
      const runMC = !!eventRunMCCommandEl.checked;
      const runShortcut = !!eventRunShortcutEl.checked;
      eventMCCommandEl.disabled = !runMC;
      eventMCCommandEl.required = runMC;
      eventMCCommandEl.hidden = !runMC;
      eventMCCommandEl.style.display = runMC ? "" : "none";
      eventShortcutKeysEl.required = runShortcut;
      eventShortcutPicker.setDisabled(!runShortcut);
      eventShortcutHoldMsEl.disabled = !runShortcut;
      if (shortcutRowEl) {
        shortcutRowEl.hidden = !runShortcut;
        shortcutRowEl.style.display = runShortcut ? "" : "none";
      }
    }

    function syncLabelHint() {
      const eventType = eventTypeEl.value;
      const allowLabel = eventType === "comment" || eventType === "like";
      eventLabelEl.hidden = !allowLabel;
      if (!allowLabel) {
        eventLabelEl.value = "";
      }
      if (eventType === "like") {
        eventLabelEl.placeholder = currentLang === "id" ? "Jumlah like (angka, contoh 10)" : "Like count (number, e.g. 10)";
        return;
      }
      if (eventType === "comment") {
        eventLabelEl.placeholder = currentLang === "id" ? "Teks komentar yang dicocokkan (contoh halo)" : "Comment text to match (e.g. hello)";
        return;
      }
      if (eventType === "gift") {
        eventLabelEl.placeholder = currentLang === "id" ? "Label opsional (contoh trigger gift)" : "Optional label (e.g. gift trigger)";
        return;
      }
      eventLabelEl.placeholder = currentLang === "id" ? "Label event (opsional)" : "Event label (optional)";
    }

    async function loadGiftOptions() {
      try {
        const res = await fetch("/api/gifts");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "failed to load gift-list.json");
        const regular = Array.isArray(data.items_regular) ? data.items_regular : [];
        const exclusive = Array.isArray(data.items_exclusive) ? data.items_exclusive : [];
        if (regular.length > 0 || exclusive.length > 0) {
          giftOptions = [...regular, ...exclusive];
        } else {
          giftOptions = data.items || [];
        }
        giftImageVersion = Date.now();
        refreshEventGiftOptions();
        fillGiftSelect(testEventGiftEl, giftOptions);
        testEventGiftPicker.setOptions(giftOptions);
        syncGiftFields();
        syncLabelHint();
        syncTestEventFields();
        renderEventBoxes(currentEventItems);
      } catch (err) {
        setStatus(err.message || (currentLang === "id" ? "gagal memuat gift-list.json" : "failed to load gift-list.json"), false);
      }
    }

    function renderEventRows(items) {
      eventRowsEl.innerHTML = "";
      if (!items || items.length === 0) {
        const tr = document.createElement("tr");
        tr.innerHTML = "<td colspan=\"9\">" + esc(t("ui.noEventsYet")) + "</td>";
        eventRowsEl.appendChild(tr);
        return;
      }

      const sortedItems = sortEventItems(items);
      for (const item of sortedItems) {
        const holdMs = Math.max(0, Number(item.shortcut_hold_ms || 0));
        const shortcutLabel = normalizeShortcutSymbols(item.shortcut_keys);
        const shortcutView = shortcutLabel ? (shortcutLabel + (holdMs > 0 ? (" (" + holdMs + "ms)") : "")) : "";
        const gift = findGiftByEventItem(item);
        const localGiftImage = buildGiftImagePathFromEvent(item);
        const remoteGiftImage = resolveGiftImageRemote(gift);
        const giftImage = localGiftImage || remoteGiftImage;
        const giftName = String(item.gift_name || "").trim();
        const giftNameText = giftName || "-";
        const giftThumbHTML = giftImage
          ? "<img class=\"event-table-gift-thumb\" src=\"" + esc(giftImage) + "\" alt=\"" + esc(giftNameText) + "\" loading=\"lazy\"" +
            (remoteGiftImage ? " data-fallback-src=\"" + esc(remoteGiftImage) + "\"" : "") + ">"
          : "<span class=\"event-table-gift-thumb-fallback\">IMG</span>";
        const showInExport = item.show_in_export !== false;
        const showInExportHTML = "<input type=\"checkbox\" class=\"event-show-export-toggle\" data-id=\"" + item.id + "\"" + (showInExport ? " checked" : "") + ">";
        const tr = document.createElement("tr");
        tr.innerHTML =
          "<td>" + (item.type || "") + "</td>" +
          "<td>" + esc(item.title || "") + "</td>" +
          "<td><div class=\"event-table-gift-cell\">" +
            giftThumbHTML +
            "<span class=\"event-table-gift-name\">" + esc(giftNameText) + "</span>" +
          "</div></td>" +
          "<td>" + (item.diamond ?? 0) + "</td>" +
          "<td>" + esc(getSoundFileName(item.sound_url)) + "</td>" +
          "<td>" + (item.mc_command || "") + "</td>" +
          "<td>" + esc(shortcutView) + "</td>" +
          "<td>" + showInExportHTML + "</td>" +
          "<td><div class=\"event-actions\">" +
            "<button type=\"button\" class=\"run\" data-act=\"test\" data-id=\"" + item.id + "\">" + esc(t("ui.run")) + "</button>" +
            "<button type=\"button\" class=\"edit\" data-act=\"edit\" data-id=\"" + item.id + "\">" + esc(t("ui.edit")) + "</button>" +
            "<button type=\"button\" class=\"edit\" data-act=\"duplicate\" data-id=\"" + item.id + "\">" + esc(t("ui.duplicate")) + "</button>" +
            "<button type=\"button\" class=\"delete\" data-act=\"delete\" data-id=\"" + item.id + "\">" + esc(t("ui.delete")) + "</button>" +
          "</div>" +
          "</td>";
        const giftThumbEl = tr.querySelector(".event-table-gift-thumb");
        if (giftThumbEl) {
          giftThumbEl.addEventListener("error", () => {
            const fallback = String(giftThumbEl.dataset.fallbackSrc || "").trim();
            if (fallback && giftThumbEl.dataset.fallbackTried !== "1") {
              giftThumbEl.dataset.fallbackTried = "1";
              giftThumbEl.src = fallback;
              return;
            }
            const replacement = document.createElement("span");
            replacement.className = "event-table-gift-thumb-fallback";
            replacement.textContent = "IMG";
            giftThumbEl.replaceWith(replacement);
          });
        }
        eventRowsEl.appendChild(tr);
      }
    }

    function renderEventBoxes(items) {
      if (!eventBoxRowsEl) return;
      eventBoxRowsEl.innerHTML = "";
      if (eventPaginationEl) {
        eventPaginationEl.innerHTML = "";
        eventPaginationEl.style.display = "none";
      }
      stopEventSlider();

      const eventBoxItems = (items || []).filter((item) => {
        if (item.show_in_export === false) return false;
        const t = normalizeEventType(item.type);
        return t === "gift" || t === "like" || t === "follow" || t === "share";
      });

      if (eventBoxItems.length === 0) {
        const empty = document.createElement("div");
        empty.className = "event-empty-state";
        empty.textContent = t("ui.noEventsYet");
        eventBoxRowsEl.appendChild(empty);
        resetEventLoopPosition(eventBoxRowsEl);
        syncEventSlideButtons(0);
        syncEventBoxPopup();
        return;
      }

      const sortedItems = sortEventItems(eventBoxItems);
      const visibleSize = getEventBoxVisibleSize();
      const pages = [];
      for (let i = 0; i < sortedItems.length; i += visibleSize) {
        pages.push(sortedItems.slice(i, i + visibleSize));
      }

      for (const pageItems of pages) {
        const slide = document.createElement("div");
        slide.className = "event-box-slide";

        for (const item of pageItems) {
          const eventType = normalizeEventType(item.type);
          const isGift = eventType === "gift";
          const gift = findGiftByEventItem(item);
          const title = String(
            item.title ||
            item.gift_name ||
            (gift && gift.nama_gift) ||
            (getEventTypeCardLabel(eventType) + " #" + item.id)
          );
          const localGiftImage = buildGiftImagePathFromEvent(item);
          const remoteGiftImage = resolveGiftImageRemote(gift);
          const giftImage = isGift ? (localGiftImage || remoteGiftImage) : "";
          const subtitle = isGift
            ? buildGiftBoxCaption(item)
            : (String(item.title || "").trim() || getEventTypeCardLabel(eventType));

          const card = document.createElement("article");
          card.className = "event-card event-card-gift";

          const frame = document.createElement("div");
          frame.className = "event-card-gift-frame";

          if (isGift && giftImage) {
            const img = document.createElement("img");
            img.className = "event-card-gift-image";
            img.src = giftImage;
            img.alt = title;
            img.loading = "lazy";
            img.addEventListener("error", () => {
              if (isGift && remoteGiftImage && img.dataset.fallbackTried !== "1" && img.src !== remoteGiftImage) {
                img.dataset.fallbackTried = "1";
                img.src = remoteGiftImage;
                return;
              }
              const fallback = document.createElement("div");
              fallback.className = "event-card-gift-fallback";
              fallback.innerHTML = getEventTypeCardLabel(eventType) + "<br>Event";
              frame.replaceChildren(fallback);
            });
            frame.appendChild(img);
          } else if (!isGift) {
            const iconWrap = document.createElement("div");
            iconWrap.className = "event-card-type-icon-wrap";

            const icon = document.createElement("i");
            icon.className = "fa-solid " + getEventTypeIconClass(eventType) + " event-card-type-icon";
            icon.setAttribute("aria-hidden", "true");
            iconWrap.appendChild(icon);

            if (eventType === "like") {
              const rawLike = String(item.label || "").trim();
              const likeCount = Number(rawLike);
              const likeText = Number.isFinite(likeCount) && likeCount > 0 ? String(Math.round(likeCount)) : rawLike;
              if (likeText) {
                const countEl = document.createElement("span");
                countEl.className = "event-card-type-icon-count";
                countEl.textContent = likeText;
                iconWrap.appendChild(countEl);
              }
            }

            frame.appendChild(iconWrap);
          } else {
            const fallback = document.createElement("div");
            fallback.className = "event-card-gift-fallback";
            fallback.innerHTML = getEventTypeCardLabel(eventType) + "<br>Event";
            frame.appendChild(fallback);
          }

          card.appendChild(frame);

          const subtitleEl = document.createElement("div");
          subtitleEl.className = "event-card-gift-subtitle";
          subtitleEl.textContent = subtitle;

          card.appendChild(subtitleEl);
          slide.appendChild(card);
        }

        while (slide.children.length < visibleSize) {
          const filler = document.createElement("article");
          filler.className = "event-card event-card-empty";
          filler.setAttribute("aria-hidden", "true");
          slide.appendChild(filler);
        }

        eventBoxRowsEl.appendChild(slide);
      }

      applyEventRowTextLayout(eventBoxRowsEl);
      setupEventLoop(pages.length);
    }

    function refreshLikeGoalTriggerOptions(selectedId) {
      if (!likeGoalTriggerEventEl) return;
      const selected = Number(selectedId || likeGoalTriggerEventEl.value || 0);
      const rows = [...(currentEventItems || [])].sort((a, b) => Number(a.id || 0) - Number(b.id || 0));
      const options = [{ value: "", label: t("ui.likeGoalSelectTrigger") }];
      for (const item of rows) {
        const labelTitle = String(item.title || "").trim();
        const label = labelTitle || String(item.type || "event");
        options.push({
          value: String(item.id),
          label: label
        });
      }
      likeGoalTriggerPicker.setOptions(options);
      if (selected > 0 && options.some((item) => Number(item.value) === selected)) {
        likeGoalTriggerEventEl.value = String(selected);
      } else {
        likeGoalTriggerEventEl.value = "";
      }
      likeGoalTriggerPicker.syncFromSelect();
    }

    function renderLikeGoalState(state) {
      if (!state) return;
      likeGoalState = state;
      const title = String(state.title || "Like Goal").trim() || "Like Goal";
      const goal = Math.max(1, Number(state.goal || 1));
      const currentGoal = Math.max(1, Number(state.current_goal || goal));
      const currentLikes = Math.max(0, Number(state.current_likes || 0));
      const modeID = Math.max(0, Number(state.mode_id || 0));
      const mode = modeID === 2 ? "double" : (String(state.mode || "increase").toLowerCase() === "double" ? "double" : "increase");
      const triggerEventId = Math.max(0, Number(state.trigger_event_id || 0));
      const enabled = !!state.enabled;
      const percent = Math.max(0, Math.min(100, Math.round((currentLikes / currentGoal) * 100)));

      if (likeGoalTitleEl) likeGoalTitleEl.value = title;
      if (likeGoalValueEl) likeGoalValueEl.value = String(goal);
      if (likeGoalModeEl) likeGoalModeEl.value = mode;
      likeGoalModePicker.syncFromSelect();
      if (likeGoalEnabledEl) likeGoalEnabledEl.checked = enabled;

      refreshLikeGoalTriggerOptions(triggerEventId);

      if (likeGoalPreviewTitleEl) likeGoalPreviewTitleEl.textContent = title;
      if (likeGoalProgressTextEl) likeGoalProgressTextEl.textContent = currentLikes + " / " + currentGoal;
      if (likeGoalProgressBarEl) likeGoalProgressBarEl.style.width = percent + "%";
    }

    async function loadLikeGoalState(options = {}) {
      const silent = !!options.silent;
      if (!likeGoalTitleEl) return;
      try {
        const res = await fetch("/api/like-goal");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "failed to load like goal");
        renderLikeGoalState(data.state || {});
      } catch (err) {
        if (!silent) {
          setStatus(err.message || (currentLang === "id" ? "gagal memuat target like" : "failed to load like goal"), false);
        }
      }
    }

    async function resetLikeGoalProgress() {
      if (!likeGoalTitleEl) return;
      const res = await fetch("/api/like-goal/reset", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "failed to reset like goal progress");
      renderLikeGoalState(data.state || {});
      setStatus(t("msg.likeGoalReset"), true);
    }

    async function testLikeGoalNow() {
      if (!likeGoalState) {
        throw new Error(currentLang === "id" ? "state target like belum siap" : "like goal state is not ready");
      }
      const res = await fetch("/api/like-goal/test", { method: "POST" });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "failed to test like goal");
      if (data.state) {
        renderLikeGoalState(data.state);
      }
      setStatus(t("msg.likeGoalTestSent"), true);
    }

    function collectSettingsPayload() {
      const username = String(usernameEl && usernameEl.value ? usernameEl.value : "").trim().replace(/^@+/, "");
      const mcMode = String(mcModeEl && mcModeEl.value ? mcModeEl.value : "rcon").trim().toLowerCase() === "servertap" ? "servertap" : "rcon";
      commitCurrentMinecraftPassword();
      commitCurrentMinecraftPort();
      const mcHost = String(mcHostEl && mcHostEl.value ? mcHostEl.value : "").trim();
      const defaultPort = mcMode === "servertap" ? 4567 : 25575;
      const mcPort = Math.max(1, Math.min(65535, Number(mcPortEl && mcPortEl.value ? mcPortEl.value : defaultPort) || defaultPort));
      const mcPassword = mcMode === "servertap" ? mcServerTapPasswordCache : mcRCONPasswordCache;
      const mcServerTapPath = String(mcServerTapPathEl && mcServerTapPathEl.value ? mcServerTapPathEl.value : "/v1/server/exec").trim();
      const mcEnabled = !!(mcEnabledEl && mcEnabledEl.checked);
      const likeGoalTitle = String(likeGoalTitleEl && likeGoalTitleEl.value ? likeGoalTitleEl.value : "").trim();
      const likeGoalGoal = Math.max(1, Number(likeGoalValueEl && likeGoalValueEl.value ? likeGoalValueEl.value : 1) || 1);
      const likeGoalModeID = String(likeGoalModeEl && likeGoalModeEl.value ? likeGoalModeEl.value : "increase").toLowerCase() === "double" ? 2 : 1;
      const likeGoalTriggerEventID = Math.max(0, Number(likeGoalTriggerEventEl && likeGoalTriggerEventEl.value ? likeGoalTriggerEventEl.value : 0) || 0);
      const likeGoalEnabled = !!(likeGoalEnabledEl && likeGoalEnabledEl.checked);
      const eventBoxPerRow = getEventBoxColumns();
      return {
        username,
        active_profile: getSelectedPresetProfileName() || pendingActivePresetProfile || "",
        minecraft: {
          enabled: mcEnabled,
          mode: mcMode,
          host: mcHost,
          port: mcPort,
          password: mcPassword,
          rcon_port: Math.max(1, Math.min(65535, Number(mcRCONPortCache) || 25575)),
          servertap_port: Math.max(1, Math.min(65535, Number(mcServerTapPortCache) || 4567)),
          rcon_password: mcRCONPasswordCache,
          servertap_password: mcServerTapPasswordCache,
          servertap_path: mcServerTapPath
        },
        like_goal: {
          title: likeGoalTitle,
          goal: likeGoalGoal,
          mode_id: likeGoalModeID,
          trigger_event_id: likeGoalTriggerEventID,
          enabled: likeGoalEnabled
        },
        event_box: {
          per_row: eventBoxPerRow
        }
      };
    }

    function applyLoadedSettings(settings) {
      if (!settings || typeof settings !== "object") return;

      const username = String(settings.username || "").trim();
      if (usernameEl && username) {
        usernameEl.value = username;
      }
      const activeProfile = String(settings.active_profile || "").trim();
      if (activeProfile) {
        pendingActivePresetProfile = activeProfile;
        try {
          localStorage.setItem(ACTIVE_PRESET_PROFILE_STORAGE_KEY, activeProfile);
        } catch (_) {}
        if (presetProfileSelectEl && presetProfiles.some((p) => String(p && p.profile_name ? p.profile_name : "").trim() === activeProfile)) {
          presetProfileSelectEl.value = activeProfile;
        }
      }

      const mc = settings.minecraft || {};
      if (mcModeEl && typeof mc.mode === "string") {
        mcModeEl.value = String(mc.mode).toLowerCase() === "servertap" ? "servertap" : "rcon";
      }
      if (mcHostEl && typeof mc.host === "string") mcHostEl.value = mc.host;
      const normalizedMode = String(mc.mode || "").toLowerCase() === "servertap" ? "servertap" : "rcon";
      const legacyPort = Number(mc.port || 0);
      const rawRCONPort = Number(mc.rcon_port || 0);
      const rawServerTapPort = Number(mc.servertap_port || 0);
      mcRCONPortCache = Math.max(1, Math.min(65535, rawRCONPort > 0 ? rawRCONPort : (legacyPort > 0 && normalizedMode !== "servertap" ? legacyPort : 25575)));
      mcServerTapPortCache = Math.max(1, Math.min(65535, rawServerTapPort > 0 ? rawServerTapPort : (legacyPort > 0 && normalizedMode === "servertap" ? legacyPort : 4567)));
      if (mcPortEl) {
        const currentMode = String(mcModeEl && mcModeEl.value ? mcModeEl.value : "rcon").toLowerCase() === "servertap" ? "servertap" : "rcon";
        mcPortEl.value = String(currentMode === "servertap" ? mcServerTapPortCache : mcRCONPortCache);
      }
      const rawRCONPassword = String(mc.rcon_password || "").trim();
      const rawServerTapPassword = String(mc.servertap_password || "").trim();
      const rawLegacyPassword = String(mc.password || "").trim();
      mcRCONPasswordCache = rawRCONPassword || rawLegacyPassword || "123";
      mcServerTapPasswordCache = rawServerTapPassword || (normalizedMode === "servertap" && rawLegacyPassword ? rawLegacyPassword : "") || "change_me";
      if (mcPasswordEl) {
        const currentMode = String(mcModeEl && mcModeEl.value ? mcModeEl.value : "rcon").toLowerCase() === "servertap" ? "servertap" : "rcon";
        mcPasswordEl.value = currentMode === "servertap" ? mcServerTapPasswordCache : mcRCONPasswordCache;
      }
      if (mcServerTapPathEl && typeof mc.servertap_path === "string" && mc.servertap_path.trim()) {
        mcServerTapPathEl.value = mc.servertap_path;
      }
      if (mcEnabledEl) {
        mcEnabledEl.checked = mc.enabled !== false;
      }
      syncMinecraftConnectorModeUI();

      const goalState = settings.like_goal || {};
      if (goalState && typeof goalState === "object" && Object.keys(goalState).length > 0) {
        renderLikeGoalState(goalState);
      }
      const eventBox = settings.event_box || {};
      const eventBoxPerRow = Number(eventBox.per_row || 0);
      if (eventBoxPerRow > 0) {
        const appliedColumns = applyEventBoxColumns(eventBoxPerRow);
        try {
          localStorage.setItem(EVENT_BOX_PER_ROW_STORAGE_KEY, String(appliedColumns));
        } catch (_) {}
      }
    }

    async function saveUnifiedSettings(options = {}) {
      const silent = !!options.silent;
      const payload = collectSettingsPayload();
      const res = await fetch("/api/settings", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || (currentLang === "id" ? "gagal menyimpan pengaturan" : "failed to save settings"));
      applyLoadedSettings(data.settings || payload);
      if (data.like_goal_state) {
        renderLikeGoalState(data.like_goal_state);
      }
      if (!silent) {
        setStatus(t("msg.settingsSaved"), true);
      }
    }

    function scheduleUnifiedSettingsAutosave() {
      if (settingsAutosaveTimer) {
        clearTimeout(settingsAutosaveTimer);
      }
      settingsAutosaveTimer = setTimeout(async () => {
        settingsAutosaveTimer = null;
        try {
          await saveUnifiedSettings({ silent: true });
          await persistActivePresetProfile({ silent: true });
        } catch (err) {
          setStatus(err.message || (currentLang === "id" ? "gagal menyimpan pengaturan" : "failed to save settings"), false);
        }
      }, 350);
    }

    async function loadUnifiedSettings(options = {}) {
      const silent = !!options.silent;
      const res = await fetch("/api/settings");
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || (currentLang === "id" ? "gagal memuat pengaturan" : "failed to load settings"));
      applyLoadedSettings(data.settings || {});
      if (data.like_goal_state) {
        renderLikeGoalState(data.like_goal_state);
      }
      if (!silent) {
        setStatus(t("msg.settingsLoaded"), true);
      }
    }

    async function loadEventsTable() {
      try {
        const res = await fetch("/api/events");
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || (currentLang === "id" ? "gagal memuat event" : "failed to load events"));
        currentEventItems = data.items || [];
        renderEventRows(currentEventItems);
        refreshEventGiftOptions();
        refreshShortcutOptions();
        renderEventBoxes(currentEventItems);
        refreshLikeGoalTriggerOptions(likeGoalState && likeGoalState.trigger_event_id);
      } catch (err) {
        setStatus(err.message || (currentLang === "id" ? "gagal memuat event" : "failed to load events"), false);
      }
    }

    async function refreshState() {
      try {
        const res = await fetch("/state");
        const state = await res.json();
        if (state && state.username) {
          usernameEl.value = state.username || "";
        }
        if (state.running) {
          hasConnectedTikTok = true;
          setStatus(t("msg.tracking", { username: state.username || "-" }), true);
        } else {
          setStatus(t("msg.idle"), false);
        }
      } catch (_) {
        setStatus(t("msg.fetchStateFailed"), false);
      }
    }

    async function refreshGiftsByUsername(username, options = {}) {
      const silent = !!options.silent;
      username = String(username || "").trim().replace(/^@+/, "");
      if (!username) return;

      try {
        const res = await fetch("/api/gifts/refresh", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || (currentLang === "id" ? "gagal memperbarui daftar gift" : "failed to refresh gift list"));

        await loadGiftOptions();
        if (!silent) {
          const region = String(data.region || "").trim();
          const source = String(data.source || "").trim();
          const regionLabel = region ? (" (" + region + ")") : "";
          const sourceLabel = source ? (" [" + source + "]") : "";
          setStatus(t("msg.giftRefreshed", { username, region: regionLabel, source: sourceLabel }), true);
        }
      } catch (err) {
        if (!silent) {
          setStatus(err.message || (currentLang === "id" ? "gagal memperbarui daftar gift" : "failed to refresh gift list"), false);
        }
      }
    }

    // =========================
    // UI Event Bindings
    // =========================
    startBtn.addEventListener("click", async () => {
      const username = usernameEl.value.trim();
      if (!username) {
        setStatus(t("msg.requiredUsername"), false);
        return;
      }
      await refreshGiftsByUsername(username);
    });

    connectBtn.addEventListener("click", async () => {
      const username = usernameEl.value.trim();
      if (!username) {
        setStatus(t("msg.requiredUsername"), false);
        return;
      }
      try {
        const res = await fetch("/start", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ username })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || (currentLang === "id" ? "gagal memulai" : "start failed"));
        hasConnectedTikTok = true;
        setStatus(t("msg.starting", { username }), true);
      } catch (err) {
        setStatus(err.message || (currentLang === "id" ? "gagal memulai" : "start failed"), false);
      }
    });

    stopBtn.addEventListener("click", async () => {
      try {
        const res = await fetch("/stop", { method: "POST" });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || (currentLang === "id" ? "gagal berhenti" : "stop failed"));
        setStatus(t("msg.stopped"), false);
      } catch (err) {
        setStatus(err.message || (currentLang === "id" ? "gagal berhenti" : "stop failed"), false);
      }
    });

    usernameEl.addEventListener("keydown", (e) => {
      if (e.key === "Enter") connectBtn.click();
    });

    if (languageToggleBtn) {
      languageToggleBtn.addEventListener("click", () => {
        currentLang = currentLang === "id" ? "en" : "id";
        localStorage.setItem(I18N_STORAGE_KEY, currentLang);
        applyLanguageUI();
      });
    }

    function syncMinecraftConnectorModeUI() {
      const mode = String(mcModeEl && mcModeEl.value ? mcModeEl.value : "rcon").toLowerCase() === "servertap" ? "servertap" : "rcon";
      activeMinecraftMode = mode;
      if (mcPasswordEl) {
        mcPasswordEl.placeholder = mode === "servertap"
          ? (currentLang === "id" ? "Token ServerTap (opsional)" : "ServerTap token (optional)")
          : (currentLang === "id" ? "Password RCON" : "RCON password");
        mcPasswordEl.value = mode === "servertap" ? (mcServerTapPasswordCache || "change_me") : (mcRCONPasswordCache || "123");
      }
      if (mcServerTapPathEl) {
        const show = mode === "servertap";
        mcServerTapPathEl.style.display = show ? "" : "none";
        if (!mcServerTapPathEl.value.trim()) {
          mcServerTapPathEl.value = "/v1/server/exec";
        }
      }
      if (mcPortEl) {
        const nextPort = mode === "servertap" ? mcServerTapPortCache : mcRCONPortCache;
        mcPortEl.value = String(Math.max(1, Math.min(65535, Number(nextPort) || (mode === "servertap" ? 4567 : 25575))));
      }
      syncMinecraftEnabledUI();
    }

    function syncMinecraftEnabledUI() {
      const enabled = !!(mcEnabledEl && mcEnabledEl.checked);
      if (mcModeEl) mcModeEl.disabled = !enabled;
      if (mcHostEl) mcHostEl.disabled = !enabled;
      if (mcPortEl) mcPortEl.disabled = !enabled;
      if (mcPasswordEl) mcPasswordEl.disabled = !enabled;
      if (mcServerTapPathEl) mcServerTapPathEl.disabled = !enabled;
      if (mcConnectBtn) mcConnectBtn.disabled = !enabled;
      if (mcDisconnectBtn) mcDisconnectBtn.disabled = !enabled;
      if (mcCommandEl) mcCommandEl.disabled = !enabled;
      if (mcSendBtn) mcSendBtn.disabled = !enabled;
    }

    function commitCurrentMinecraftPassword(modeOverride) {
      if (!mcPasswordEl) return;
      const mode = String(modeOverride || activeMinecraftMode || "rcon").toLowerCase() === "servertap" ? "servertap" : "rcon";
      const current = String(mcPasswordEl.value || "").trim();
      if (mode === "servertap") {
        mcServerTapPasswordCache = current || "change_me";
      } else {
        mcRCONPasswordCache = current || "123";
      }
    }

    function commitCurrentMinecraftPort(modeOverride) {
      if (!mcPortEl) return;
      const mode = String(modeOverride || activeMinecraftMode || "rcon").toLowerCase() === "servertap" ? "servertap" : "rcon";
      const fallback = mode === "servertap" ? 4567 : 25575;
      const current = Math.max(1, Math.min(65535, Number(mcPortEl.value || 0) || fallback));
      if (mode === "servertap") {
        mcServerTapPortCache = current;
      } else {
        mcRCONPortCache = current;
      }
    }

    mcConnectBtn.addEventListener("click", async () => {
      if (mcEnabledEl && !mcEnabledEl.checked) {
        setMCOutput(t("msg.mcConnectorDisabled"));
        return;
      }
      const mode = String(mcModeEl && mcModeEl.value ? mcModeEl.value : "rcon").toLowerCase() === "servertap" ? "servertap" : "rcon";
      commitCurrentMinecraftPassword();
      commitCurrentMinecraftPort();
      const payload = {
        mode,
        host: mcHostEl.value.trim(),
        port: Number(mcPortEl.value || 0),
        password: mode === "servertap" ? mcServerTapPasswordCache : mcRCONPasswordCache,
        servertap_path: String(mcServerTapPathEl && mcServerTapPathEl.value ? mcServerTapPathEl.value : "").trim()
      };
      try {
        const res = await fetch("/api/minecraft/connect", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || t("msg.mcConnectorConnectFailed"));
        setMCOutput(mode === "servertap" ? t("msg.servertapConnected") : t("msg.rconConnected"));
      } catch (err) {
        setMCOutput(err.message || t("msg.mcConnectorConnectFailed"));
      }
    });

    mcDisconnectBtn.addEventListener("click", async () => {
      if (mcEnabledEl && !mcEnabledEl.checked) {
        setMCOutput(t("msg.mcConnectorDisabled"));
        return;
      }
      try {
        const mode = String(mcModeEl && mcModeEl.value ? mcModeEl.value : "rcon").toLowerCase() === "servertap" ? "servertap" : "rcon";
        const res = await fetch("/api/minecraft/disconnect", { method: "POST" });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || t("msg.mcConnectorDisconnectFailed"));
        setMCOutput(mode === "servertap" ? t("msg.servertapDisconnected") : t("msg.rconDisconnected"));
      } catch (err) {
        setMCOutput(err.message || t("msg.mcConnectorDisconnectFailed"));
      }
    });

    mcSendBtn.addEventListener("click", async () => {
      if (mcEnabledEl && !mcEnabledEl.checked) {
        setMCOutput(t("msg.mcConnectorDisabled"));
        return;
      }
      const command = mcCommandEl.value.trim();
      if (!command) {
        setMCOutput(t("msg.emptyCommand"));
        return;
      }
      try {
        const res = await fetch("/api/minecraft/command", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ command })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || (currentLang === "id" ? "gagal mengirim perintah" : "failed to send command"));
        setMCOutput(data.output || t("msg.noOutput"));
      } catch (err) {
        setMCOutput(err.message || (currentLang === "id" ? "gagal mengirim perintah" : "failed to send command"));
      }
    });

    mcCommandEl.addEventListener("keydown", (e) => {
      if ((e.ctrlKey || e.metaKey) && e.key === "Enter") {
        e.preventDefault();
        mcSendBtn.click();
      }
    });

    if (mcModeEl) {
      mcModeEl.addEventListener("change", () => {
        const prevMode = activeMinecraftMode;
        commitCurrentMinecraftPort(prevMode);
        commitCurrentMinecraftPassword(prevMode);
        syncMinecraftConnectorModeUI();
      });
    }

    if (mcEnabledEl) {
      mcEnabledEl.addEventListener("change", async () => {
        syncMinecraftEnabledUI();
        if (!mcEnabledEl.checked) {
          try {
            await fetch("/api/minecraft/disconnect", { method: "POST" });
          } catch (_) {
            // ignore disconnect failure while disabling from UI
          }
        }
      });
    }

    if (mcPasswordEl) {
      mcPasswordEl.addEventListener("input", () => {
        commitCurrentMinecraftPassword(activeMinecraftMode);
      });
    }

    if (mcPortEl) {
      mcPortEl.addEventListener("input", () => {
        commitCurrentMinecraftPort(activeMinecraftMode);
      });
    }

    function syncTestEventFields() {
      const isGift = testEventTypeEl.value === "gift";
      const isChat = testEventTypeEl.value === "chat";
      const needsCount = isGift || testEventTypeEl.value === "like";
      testEventGiftEl.disabled = !isGift;
      testEventGiftPickerHostEl.hidden = !isGift;
      testEventGiftPickerHostEl.style.display = isGift ? "" : "none";
      testEventGiftPicker.setDisabled(!isGift);
      testEventCountEl.hidden = !needsCount;
      testEventCountEl.style.display = needsCount ? "" : "none";
      testEventTextEl.hidden = !isChat;
      testEventTextEl.style.display = isChat ? "" : "none";
      if (!isGift) {
        testEventGiftEl.value = "";
        testEventGiftPicker.syncFromSelect();
      } else if (!testEventGiftEl.value && giftOptions.length > 0) {
        testEventGiftEl.value = String(giftOptions[0].id);
      }
      if (!isChat) {
        testEventTextEl.value = "";
      }
      if (!needsCount) {
        testEventCountEl.value = "1";
      }
      testEventGiftPicker.syncFromSelect();

      if (testEventRowEl) {
        testEventRowEl.classList.remove("mode-giftlike", "mode-chat", "mode-count", "mode-basic");
        if (isChat) {
          testEventRowEl.classList.add("mode-chat");
        } else if (isGift) {
          testEventRowEl.classList.add("mode-giftlike");
        } else if (needsCount) {
          testEventRowEl.classList.add("mode-count");
        } else {
          testEventRowEl.classList.add("mode-basic");
        }
      }
    }

    testEventTypeEl.addEventListener("change", syncTestEventFields);

    testEventBtn.addEventListener("click", async () => {
      if (simulateCountdownBusy) return;
      const type = testEventTypeEl.value;
      const username = (testEventUsernameEl.value || "").trim() || "TestPlayer";
      const giftId = Number(testEventGiftEl.value || 0);
      const repeatCount = Math.max(1, Number(testEventCountEl.value || 1));
      const text = (testEventTextEl.value || "").trim();

      if (type === "gift" && !giftId) {
        setStatus(currentLang === "id" ? "pilih gift untuk simulasi" : "select a gift for simulation", false);
        return;
      }
      simulateCountdownBusy = true;
      const originalBtnText = testEventBtn.textContent;
      testEventBtn.disabled = true;
      try {
        for (let sec = 3; sec >= 1; sec -= 1) {
          setStatus(t("msg.simulateCountdown", { sec }), false);
          testEventBtn.textContent = t("ui.simulate") + " (" + sec + ")";
          await new Promise((resolve) => setTimeout(resolve, 1000));
        }
        testEventBtn.textContent = currentLang === "id" ? "Mensimulasikan..." : "Simulating...";
        const res = await fetch("/api/test/event", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            type,
            username,
            gift_id: giftId,
            repeatcount: repeatCount,
            text
          })
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || (currentLang === "id" ? "gagal simulasi event" : "failed to simulate event"));
        setStatus(t("msg.eventSimulated", { type: data.type || type, username }), true);
        setMCOutput(t("msg.simulatedOutput", { type: data.type || type, message: data.message || data.gift_name || "ok" }));
      } catch (err) {
        setStatus(err.message || (currentLang === "id" ? "gagal simulasi event" : "failed to simulate event"), false);
        setMCOutput(err.message || (currentLang === "id" ? "gagal simulasi event" : "failed to simulate event"));
      } finally {
        testEventBtn.disabled = false;
        testEventBtn.textContent = originalBtnText;
        simulateCountdownBusy = false;
      }
    });

    eventForm.addEventListener("submit", async (e) => {
      e.preventDefault();
      const type = eventTypeEl.value;
      const giftId = Number(eventGiftEl.value || 0);
      const runMCCommand = !!eventRunMCCommandEl.checked;
      const runShortcut = !!eventRunShortcutEl.checked;
      const shortcutKeys = normalizeShortcutSymbols(eventShortcutKeysEl.value);
      const shortcutHoldMs = Math.max(0, Math.min(10000, Number(eventShortcutHoldMsEl.value || 0)));
      const payload = {
        type: type,
        title: eventTitleEl.value.trim(),
        label: eventLabelEl.value.trim(),
        gift_id: type === "gift" ? giftId : 0,
        repeat_by_gift_combo: type === "gift" ? !!(eventRepeatByGiftComboEl && eventRepeatByGiftComboEl.checked) : false,
        show_in_export: !!(eventShowInExportEl && eventShowInExportEl.checked),
        sound_url: normalizeSoundURL(eventSoundEl.value.trim()),
        mc_command: eventMCCommandEl.value.trim(),
        run_mc_command: runMCCommand,
        run_shortcut: runShortcut,
        shortcut_keys: shortcutKeys,
        shortcut_hold_ms: shortcutHoldMs
      };
      if (!payload.type) {
        setStatus(currentLang === "id" ? "tipe event wajib diisi" : "event type is required", false);
        return;
      }
      if (!runMCCommand && !runShortcut) {
        setStatus(currentLang === "id" ? "pilih minimal satu: Perintah MC atau Shortcut Keyboard" : "select at least one: MC Command or Keyboard Shortcut", false);
        return;
      }
      if (runMCCommand && !payload.mc_command) {
        setStatus(currentLang === "id" ? "perintah minecraft wajib diisi" : "minecraft command is required", false);
        return;
      }
      if (runShortcut && !shortcutKeys) {
        setStatus(currentLang === "id" ? "shortcut keyboard wajib diisi" : "keyboard shortcut is required", false);
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
        if (!res.ok) throw new Error(data.error || (currentLang === "id" ? "gagal menyimpan" : "failed to save"));
        setStatus(isUpdate ? t("msg.eventUpdated") : t("msg.eventCreated"), true);
        resetEventForm();
        closeEventModal();
        await loadEventsTable();
        await persistActivePresetProfile({ silent: true });
      } catch (err) {
        setStatus(err.message || (currentLang === "id" ? "gagal menyimpan event" : "failed to save event"), false);
      }
    });

    resetEventBtn.addEventListener("click", () => {
      resetEventForm();
    });

    openEventModalBtn.addEventListener("click", () => {
      resetEventForm();
      openEventModal(false);
    });

    if (openCreatePresetProfileModalBtn) {
      openCreatePresetProfileModalBtn.addEventListener("click", () => {
        openCreatePresetProfileModal();
      });
    }

    if (presetProfileSelectEl) {
      presetProfileSelectEl.addEventListener("change", async () => {
        const profileName = String(presetProfileSelectEl.value || "").trim();
        if (!profileName) return;
        try {
          await applySelectedPresetProfile(profileName);
        } catch (err) {
          setStatus(err.message || (currentLang === "id" ? "gagal memuat profile preset" : "failed to load preset profile"), false);
        }
      });
    }

    if (savePresetProfileBtn) {
      savePresetProfileBtn.addEventListener("click", async () => {
        const profileName = getSelectedPresetProfileName();
        if (!profileName) {
          setStatus(t("msg.selectPresetProfileFirst"), false);
          return;
        }
        try {
          await persistActivePresetProfile({ silent: false });
        } catch (err) {
          setStatus(err.message || (currentLang === "id" ? "gagal menyimpan profile preset" : "failed to save preset profile"), false);
        }
      });
    }

    if (renamePresetProfileBtn && presetProfileSelectEl) {
      renamePresetProfileBtn.addEventListener("click", () => {
        const oldProfileName = String(presetProfileSelectEl.value || "").trim();
        if (!oldProfileName) {
          setStatus(t("msg.selectPresetProfileFirst"), false);
          return;
        }
        openRenamePresetProfileModal(oldProfileName);
      });
    }

    if (closeRenamePresetProfileModalBtn) {
      closeRenamePresetProfileModalBtn.addEventListener("click", () => {
        closeRenamePresetProfileModal();
      });
    }

    if (cancelRenamePresetProfileBtn) {
      cancelRenamePresetProfileBtn.addEventListener("click", () => {
        closeRenamePresetProfileModal();
      });
    }

    if (renamePresetProfileForm) {
      renamePresetProfileForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        const oldProfileName = String(renamePresetSourceProfile || "").trim();
        let newProfileName = String(renamePresetProfileNameEl && renamePresetProfileNameEl.value ? renamePresetProfileNameEl.value : "").trim();
        newProfileName = newProfileName.replace(/\.json$/i, "").replace(/^P-/i, "").trim();
        if (!oldProfileName) {
          setStatus(t("msg.selectPresetProfileFirst"), false);
          closeRenamePresetProfileModal();
          return;
        }
        if (!newProfileName) {
          setStatus(t("msg.profileNameRequired"), false);
          if (renamePresetProfileNameEl) renamePresetProfileNameEl.focus();
          return;
        }
        try {
          const result = await renamePresetProfile(oldProfileName, newProfileName);
          await refreshPresetProfiles({ silent: false });
          const selectedProfile = String(result.new_profile_name || newProfileName);
          renderPresetProfileOptions(selectedProfile);
          closeRenamePresetProfileModal();
          setStatus(t("msg.presetProfileRenamed", {
            oldName: String(result.old_profile_name || oldProfileName),
            newName: selectedProfile
          }), true);
        } catch (err) {
          setStatus(err.message || (currentLang === "id" ? "gagal rename profile preset" : "failed to rename preset profile"), false);
        }
      });
    }

    if (closeCreatePresetProfileModalBtn) {
      closeCreatePresetProfileModalBtn.addEventListener("click", () => {
        closeCreatePresetProfileModal();
      });
    }

    if (cancelCreatePresetProfileBtn) {
      cancelCreatePresetProfileBtn.addEventListener("click", () => {
        closeCreatePresetProfileModal();
      });
    }

    if (createPresetProfileForm) {
      createPresetProfileForm.addEventListener("submit", async (e) => {
        e.preventDefault();
        let profileName = String(createPresetProfileNameEl && createPresetProfileNameEl.value ? createPresetProfileNameEl.value : "").trim();
        profileName = profileName.replace(/\.json$/i, "").replace(/^P-/i, "").trim();
        if (!profileName) {
          setStatus(t("msg.profileNameRequired"), false);
          if (createPresetProfileNameEl) createPresetProfileNameEl.focus();
          return;
        }
        try {
          const result = await createPresetProfile(profileName);
          await refreshPresetProfiles({ silent: false });
          const selectedProfile = String(result.profile_name || profileName);
          renderPresetProfileOptions(selectedProfile);
          await applySelectedPresetProfile(selectedProfile);
          closeCreatePresetProfileModal();
          try {
            localStorage.setItem(ACTIVE_PRESET_PROFILE_STORAGE_KEY, selectedProfile);
          } catch (_) {}
          setStatus(t("msg.presetProfileCreated", { name: selectedProfile }), true);
        } catch (err) {
          setStatus(err.message || (currentLang === "id" ? "gagal membuat profile preset" : "failed to create preset profile"), false);
        }
      });
    }

    if (resetEventsBtn) {
      resetEventsBtn.addEventListener("click", async () => {
        if (!confirm(t("msg.resetEventsConfirm"))) return;
        try {
          const res = await fetch("/api/events/reset", { method: "POST" });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || (currentLang === "id" ? "gagal reset event" : "failed to reset events"));
          await loadEventsTable();
          await persistActivePresetProfile({ silent: true });
          resetEventForm();
          closeEventModal();
          setStatus(t("msg.eventsReset"), true);
        } catch (err) {
          setStatus(err.message || (currentLang === "id" ? "gagal reset event" : "failed to reset events"), false);
        }
      });
    }

    if (openEventBoxPopupBtn) {
      openEventBoxPopupBtn.addEventListener("click", () => {
        openEventBoxModal();
      });
    }

    closeEventModalBtn.addEventListener("click", () => {
      closeEventModal();
    });

    if (closeEventBoxPopupBtn) {
      closeEventBoxPopupBtn.addEventListener("click", () => {
        closeEventBoxModal();
      });
    }

    if (howToUseBtn) {
      howToUseBtn.addEventListener("click", () => {
        openHowToModal();
      });
    }

    if (closeHowToModalBtn) {
      closeHowToModalBtn.addEventListener("click", () => {
        closeHowToModal();
      });
    }

    eventModalEl.addEventListener("click", (e) => {
      if (e.target === eventModalEl) {
        closeEventModal();
      }
    });

    if (createPresetProfileModalEl) {
      createPresetProfileModalEl.addEventListener("click", (e) => {
        if (e.target === createPresetProfileModalEl) {
          closeCreatePresetProfileModal();
        }
      });
    }

    if (renamePresetProfileModalEl) {
      renamePresetProfileModalEl.addEventListener("click", (e) => {
        if (e.target === renamePresetProfileModalEl) {
          closeRenamePresetProfileModal();
        }
      });
    }

    if (eventBoxModalEl) {
      eventBoxModalEl.addEventListener("click", (e) => {
        if (e.target === eventBoxModalEl) {
          closeEventBoxModal();
        }
      });
    }

    if (howToModalEl) {
      howToModalEl.addEventListener("click", (e) => {
        if (e.target === howToModalEl) {
          closeHowToModal();
        }
      });
    }

    document.addEventListener("keydown", (e) => {
      if (e.key !== "Escape") return;
      if (createPresetProfileModalEl && createPresetProfileModalEl.classList.contains("show")) {
        closeCreatePresetProfileModal();
        return;
      }
      if (renamePresetProfileModalEl && renamePresetProfileModalEl.classList.contains("show")) {
        closeRenamePresetProfileModal();
        return;
      }
      if (howToModalEl && howToModalEl.classList.contains("show")) {
        closeHowToModal();
      }
    });

    async function handleEventActionClick(e) {
      const btn = e.target.closest("button");
      if (!btn) return;
      const id = Number(btn.dataset.id);
      const action = btn.dataset.act;
      if (!id || !action) return;

      if (action === "edit") {
        try {
          const res = await fetch("/api/events");
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || (currentLang === "id" ? "gagal memuat" : "failed to load"));
          const item = (data.items || []).find((x) => Number(x.id) === id);
          if (!item) throw new Error(currentLang === "id" ? "event tidak ditemukan" : "event not found");
          editingEventId = id;
          eventTypeEl.value = item.type || "join";
          eventTitleEl.value = item.title || "";
          eventLabelEl.value = item.label || "";
          refreshEventGiftOptions();
          refreshShortcutOptions();
          if (item.type === "gift" && item.gift_id) {
            eventGiftEl.value = String(item.gift_id);
          } else {
            eventGiftEl.value = "";
          }
          syncGiftFields();
          syncLabelHint();
          eventSoundEl.value = item.sound_url || "";
          eventRunMCCommandEl.checked = item.run_mc_command !== false;
          eventRunShortcutEl.checked = !!item.run_shortcut;
          if (eventRepeatByGiftComboEl) {
            eventRepeatByGiftComboEl.checked = item.repeat_by_gift_combo !== false;
          }
          if (eventShowInExportEl) {
            eventShowInExportEl.checked = item.show_in_export !== false;
          }
          eventMCCommandEl.value = item.mc_command || "";
          eventShortcutKeysEl.value = normalizeShortcutSymbols(item.shortcut_keys);
          eventShortcutHoldMsEl.value = String(Math.max(0, Number(item.shortcut_hold_ms || 0)));
          eventShortcutPicker.syncFromSelect();
          syncExecutionModeFields();
          eventTypeEl.focus();
          openEventModal(true);
          setStatus(t("msg.editingEvent", { id }), true);
        } catch (err) {
          setStatus(err.message || (currentLang === "id" ? "gagal edit event" : "failed to edit event"), false);
        }
        return;
      }

      if (action === "test") {
        try {
          const res = await fetch("/api/events/test/" + id, { method: "POST" });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || (currentLang === "id" ? "gagal tes perintah" : "failed to test command"));
          setStatus(t("msg.eventTestSucceeded", { id }), true);
          setMCOutput(data.output || t("msg.noOutput"));
        } catch (err) {
          setStatus(err.message || (currentLang === "id" ? "gagal tes event" : "failed to test event"), false);
          setMCOutput(err.message || (currentLang === "id" ? "gagal tes event" : "failed to test event"));
        }
        return;
      }

      if (action === "duplicate") {
        try {
          const res = await fetch("/api/events");
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || (currentLang === "id" ? "gagal memuat" : "failed to load"));
          const item = (data.items || []).find((x) => Number(x.id) === id);
          if (!item) throw new Error(currentLang === "id" ? "event tidak ditemukan" : "event not found");

          const duplicatePayload = {
            type: item.type || "join",
            title: item.title || "",
            label: item.label || "",
            gift_id: item.type === "gift" ? Number(item.gift_id || 0) : 0,
            repeat_by_gift_combo: item.type === "gift" ? item.repeat_by_gift_combo !== false : false,
            show_in_export: item.show_in_export !== false,
            sound_url: normalizeSoundURL(item.sound_url || ""),
            mc_command: item.mc_command || "",
            run_mc_command: item.run_mc_command !== false,
            run_shortcut: !!item.run_shortcut,
            shortcut_keys: normalizeShortcutSymbols(item.shortcut_keys),
            shortcut_hold_ms: Math.max(0, Number(item.shortcut_hold_ms || 0))
          };

          const createRes = await fetch("/api/events", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(duplicatePayload)
          });
          const createData = await createRes.json();
          if (!createRes.ok) throw new Error(createData.error || (currentLang === "id" ? "gagal duplikasi" : "failed to duplicate"));

          setStatus(t("msg.eventDuplicated"), true);
          await loadEventsTable();
          await persistActivePresetProfile({ silent: true });
        } catch (err) {
          setStatus(err.message || (currentLang === "id" ? "gagal duplikasi event" : "failed to duplicate event"), false);
        }
        return;
      }

      if (action === "delete") {
        if (!confirm(t("msg.deleteEventConfirm", { id }))) return;
        try {
          const res = await fetch("/api/events/" + id, { method: "DELETE" });
          const data = await res.json();
          if (!res.ok) throw new Error(data.error || (currentLang === "id" ? "gagal menghapus" : "failed to delete"));
          if (editingEventId === id) resetEventForm();
          setStatus(t("msg.eventDeleted"), true);
          await loadEventsTable();
          await persistActivePresetProfile({ silent: true });
        } catch (err) {
          setStatus(err.message || (currentLang === "id" ? "gagal menghapus event" : "failed to delete event"), false);
        }
      }
    }

    async function handleEventShowInExportChange(e) {
      const input = e.target && e.target.closest ? e.target.closest("input.event-show-export-toggle") : null;
      if (!input) return;
      const id = Number(input.dataset.id || 0);
      if (!id) return;
      const nextValue = !!input.checked;
      input.disabled = true;
      try {
        const listRes = await fetch("/api/events");
        const listData = await listRes.json();
        if (!listRes.ok) throw new Error(listData.error || (currentLang === "id" ? "gagal memuat event" : "failed to load events"));
        const item = (listData.items || []).find((x) => Number(x.id) === id);
        if (!item) throw new Error(currentLang === "id" ? "event tidak ditemukan" : "event not found");

        const payload = {
          type: item.type || "join",
          title: item.title || "",
          label: item.label || "",
          gift_id: item.type === "gift" ? Number(item.gift_id || 0) : 0,
          repeat_by_gift_combo: item.type === "gift" ? item.repeat_by_gift_combo !== false : false,
          show_in_export: nextValue,
          sound_url: normalizeSoundURL(item.sound_url || ""),
          mc_command: item.mc_command || "",
          run_mc_command: item.run_mc_command !== false,
          run_shortcut: !!item.run_shortcut,
          shortcut_keys: normalizeShortcutSymbols(item.shortcut_keys),
          shortcut_hold_ms: Math.max(0, Number(item.shortcut_hold_ms || 0))
        };

        const updateRes = await fetch("/api/events/" + id, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload)
        });
        const updateData = await updateRes.json();
        if (!updateRes.ok) throw new Error(updateData.error || (currentLang === "id" ? "gagal menyimpan event" : "failed to save event"));

        setStatus(t("msg.eventUpdated"), true);
        await loadEventsTable();
        await persistActivePresetProfile({ silent: true });
      } catch (err) {
        input.checked = !nextValue;
        setStatus(err.message || (currentLang === "id" ? "gagal menyimpan event" : "failed to save event"), false);
      } finally {
        if (input.isConnected) {
          input.disabled = false;
        }
      }
    }

    eventTypeEl.addEventListener("change", () => {
      syncGiftFields();
      syncLabelHint();
    });
    eventRunMCCommandEl.addEventListener("change", syncExecutionModeFields);
    eventRunShortcutEl.addEventListener("change", syncExecutionModeFields);
    eventGiftEl.addEventListener("change", syncGiftFields);
    eventSoundFileEl.addEventListener("change", async () => {
      const file = eventSoundFileEl.files && eventSoundFileEl.files[0];
      if (!file) return;
      const fallbackPath = buildStaticSoundPath(file.name);
      const originalLabel = pickEventSoundBtn.textContent;
      pickEventSoundBtn.setAttribute("aria-disabled", "true");
      pickEventSoundBtn.textContent = t("msg.uploading");
      try {
        const data = await uploadSoundFile(file);
        eventSoundEl.value = data.sound_url || fallbackPath;
        setStatus(currentLang === "id" ? "suara berhasil diunggah." : "Sound uploaded successfully.", true);
      } catch (err) {
        setStatus(err.message || (currentLang === "id" ? "gagal mengunggah suara" : "failed to upload sound"), false);
      } finally {
        pickEventSoundBtn.removeAttribute("aria-disabled");
        pickEventSoundBtn.textContent = originalLabel;
        eventSoundFileEl.value = "";
      }
    });

    eventRowsEl.addEventListener("click", handleEventActionClick);
    eventRowsEl.addEventListener("change", handleEventShowInExportChange);
    if (eventBoxRowsEl) {
      eventBoxRowsEl.addEventListener("click", handleEventActionClick);
    }
    if (eventBoxPerRowEl) {
      const handleEventBoxPerRowChange = () => {
        const columns = applyEventBoxColumns(eventBoxPerRowEl.value);
        localStorage.setItem(EVENT_BOX_PER_ROW_STORAGE_KEY, String(columns));
        renderEventBoxes(currentEventItems);
        scheduleUnifiedSettingsAutosave();
      };
      eventBoxPerRowEl.addEventListener("input", handleEventBoxPerRowChange);
      eventBoxPerRowEl.addEventListener("change", handleEventBoxPerRowChange);
    }
    if (exportEventBoxBtn) {
      exportEventBoxBtn.addEventListener("click", () => {
        exportEventBoxSlidesAsPNG();
      });
    }

    if (likeGoalOverlayLinkEl) {
      likeGoalOverlayLinkEl.href = "/overlay/like-goal";
    }

    if (likeGoalCopyLinkBtn) {
      likeGoalCopyLinkBtn.addEventListener("click", async () => {
        try {
          const fullURL = window.location.origin + "/overlay/like-goal";
          await navigator.clipboard.writeText(fullURL);
          setStatus(t("msg.overlayCopied"), true);
        } catch (_) {
          setStatus(t("msg.overlayCopyFailed"), false);
        }
      });
    }

    if (likeGoalTestBtn) {
      likeGoalTestBtn.addEventListener("click", async () => {
        try {
          await testLikeGoalNow();
        } catch (err) {
          setStatus(err.message || (currentLang === "id" ? "gagal tes target like" : "failed to test like goal"), false);
        }
      });
    }

    if (likeGoalResetBtn) {
      likeGoalResetBtn.addEventListener("click", async () => {
        try {
          await resetLikeGoalProgress();
        } catch (err) {
          setStatus(err.message || (currentLang === "id" ? "gagal reset progres target like" : "failed to reset like goal progress"), false);
        }
      });
    }

    [
      usernameEl,
      mcModeEl,
      mcEnabledEl,
      mcHostEl,
      mcPortEl,
      mcPasswordEl,
      mcServerTapPathEl,
      likeGoalTitleEl,
      likeGoalValueEl,
      likeGoalModeEl,
      likeGoalTriggerEventEl,
      likeGoalEnabledEl
    ].forEach((el) => {
      if (!el) return;
      el.addEventListener("change", () => {
        scheduleUnifiedSettingsAutosave();
      });
      if (el.tagName === "INPUT") {
        const type = String(el.type || "").toLowerCase();
        if (type !== "checkbox" && type !== "radio") {
          el.addEventListener("input", () => {
            scheduleUnifiedSettingsAutosave();
          });
        }
      }
    });

    setupGlobalButtonToasts();

    document.addEventListener("pointerdown", () => {
      unlockTriggerAudio();
    }, { passive: true });
    document.addEventListener("keydown", () => {
      unlockTriggerAudio();
    });
    document.addEventListener("touchstart", () => {
      unlockTriggerAudio();
    }, { passive: true });

    // =========================
    // Stream Events (SSE)
    // =========================
    const source = new EventSource("/events");
    source.onopen = () => {
      refreshState();
    };
    source.onerror = () => {
      if (hasConnectedTikTok) {
        setStatus(t("msg.serverDisconnectedRetry"), false);
        return;
      }
      setStatus(t("msg.idle"), false);
    };
    source.onmessage = (event) => {
      try {
        const payload = JSON.parse(event.data);
        addEvent(payload);
        if (payload.type === "trigger") {
          playTriggerSound(payload.sound_url);
        }
        if (payload.type === "like_goal_state") {
          renderLikeGoalState(payload.state || {});
        }
        if (payload.type === "status") {
          const message = String(payload.message || "");
          const localized = translateKnownMessage(message);
          const lc = localized.toLowerCase();
          const ok = !lc.includes("error") && !lc.includes("gagal") && !lc.includes("failed") && !lc.includes("stopped") && !lc.includes("berhenti") && !lc.includes("terputus") && !lc.includes("disconnect");
          setStatus(localized, ok);
        }
        if (payload.type === "error") {
          setStatus(payload.error || "error", false);
        }
      } catch (_) {
      }
    };

    // =========================
    // Initial Bootstrap
    // =========================
    initLanguageMode();
    {
      const savedEventBoxCols = Number(localStorage.getItem(EVENT_BOX_PER_ROW_STORAGE_KEY) || 0);
      if (savedEventBoxCols > 0) {
        applyEventBoxColumns(savedEventBoxCols);
      } else {
        applyEventBoxColumns(getDefaultEventBoxColumns());
      }
    }
    refreshState();
    syncExecutionModeFields();
    syncLabelHint();
    loadGiftOptions();
    loadEventsTable();
    refreshPresetProfiles({ silent: true }).then(async () => {
      const savedProfile = String(localStorage.getItem(ACTIVE_PRESET_PROFILE_STORAGE_KEY) || "").trim();
      if (!savedProfile || !presetProfileSelectEl) return;
      const exists = presetProfiles.some((p) => String(p && p.profile_name ? p.profile_name : "").trim() === savedProfile);
      if (!exists) return;
      presetProfileSelectEl.value = savedProfile;
      try {
        await applySelectedPresetProfile(savedProfile);
      } catch (_) {
      }
    });
    loadLikeGoalState({ silent: true });
    loadUnifiedSettings({ silent: true }).catch(() => {});
