/**
 * Boot.dev Local Sync - Content Script
 *
 * This script injects a "Sync to Local" button into Boot.dev's editor UI
 * and handles extracting code content and sending it to the local server.
 */

(function () {
  "use strict";

  // Prevent multiple injections
  if (window.__bootdevSyncInjected) return;
  window.__bootdevSyncInjected = true;

  console.log("[Boot.dev Sync] Content script loaded");

  // ============================================================================
  // Toast Notifications
  // ============================================================================

  function showToast(message, isError = false) {
    // Remove existing toast
    const existing = document.getElementById("bootdev-sync-toast");
    if (existing) existing.remove();

    const toast = document.createElement("div");
    toast.id = "bootdev-sync-toast";

    // Apply styles from config
    Object.assign(toast.style, CONFIG.toastStyle);
    toast.style.backgroundColor = isError ? "#EF4444" : "#10B981";

    toast.textContent = message;
    document.body.appendChild(toast);

    // Auto-remove after 3 seconds
    setTimeout(() => {
      toast.style.opacity = "0";
      setTimeout(() => toast.remove(), 300);
    }, 3000);
  }

  // ============================================================================
  // Editor Discovery & Extraction
  // ============================================================================

  /**
   * Find all file tabs (buttons with .ts filenames)
   * Returns array of filenames in order: ['utils.ts', 'main_test.ts']
   */
  function findFileTabs() {
    const tabs = [...document.querySelectorAll(CONFIG.selectors.fileTabs)]
      .filter((btn) => btn.textContent.includes(".ts"))
      .map((btn) => btn.textContent.trim());

    console.log("[Boot.dev Sync] Found file tabs:", tabs);
    return tabs;
  }

  /**
   * Find all CodeMirror editor instances
   * Returns array of editor elements
   */
  function findEditors() {
    const editors = document.querySelectorAll(CONFIG.selectors.editors);
    console.log("[Boot.dev Sync] Found editors:", editors.length);
    return editors;
  }

  /**
   * Build a map of filename -> editor element
   * Assumes tabs and editors are in the same order
   */
  function buildEditorMap() {
    const tabs = findFileTabs();
    const editors = findEditors();

    const editorMap = {};
    tabs.forEach((filename, index) => {
      if (editors[index]) {
        editorMap[filename] = editors[index];
      }
    });

    console.log("[Boot.dev Sync] Editor map:", Object.keys(editorMap));
    return editorMap;
  }

  /**
   * Extract text content from a CodeMirror editor element
   */
  function extractTextFromEditor(editorElement) {
    if (!editorElement) return null;

    // CodeMirror 6: content is in .cm-line elements
    const cmLines = editorElement.querySelectorAll(".cm-line");
    if (cmLines.length > 0) {
      return Array.from(cmLines)
        .map((line) => line.textContent)
        .join("\n");
    }

    // Fallback: plain text content
    return editorElement.textContent || null;
  }

  /**
   * Get editor contents for configured files
   * Returns { code: string, test: string } based on CONFIG.files
   */
  function getEditorContents() {
    const editorMap = buildEditorMap();
    const result = {};

    // Extract code file
    if (editorMap[CONFIG.files.code]) {
      result.code = extractTextFromEditor(editorMap[CONFIG.files.code]);
      console.log(
        `[Boot.dev Sync] Extracted ${CONFIG.files.code}: ${result.code?.length || 0} chars`
      );
    } else {
      console.warn(
        `[Boot.dev Sync] Code file "${CONFIG.files.code}" not found in tabs`
      );
    }

    // Extract test file
    if (editorMap[CONFIG.files.test]) {
      result.test = extractTextFromEditor(editorMap[CONFIG.files.test]);
      console.log(
        `[Boot.dev Sync] Extracted ${CONFIG.files.test}: ${result.test?.length || 0} chars`
      );
    } else {
      console.warn(
        `[Boot.dev Sync] Test file "${CONFIG.files.test}" not found in tabs`
      );
    }

    return result;
  }

  // ============================================================================
  // Sync Logic
  // ============================================================================

  async function syncToLocal() {
    console.log("[Boot.dev Sync] Starting sync...");

    const { code, test } = getEditorContents();

    if (!code && !test) {
      showToast("Could not find any editor content to sync", true);
      console.error(
        "[Boot.dev Sync] No content found. Check CONFIG.files in config.js"
      );
      return;
    }

    const payload = {};
    if (code) payload.code = code;
    if (test) payload.test = test;

    console.log("[Boot.dev Sync] Payload:", {
      codeLength: code?.length || 0,
      testLength: test?.length || 0,
    });

    try {
      const response = await fetch(CONFIG.serverUrl, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.error || `HTTP ${response.status}`);
      }

      const data = await response.json();
      console.log("[Boot.dev Sync] Success:", data);
      showToast(`Synced! ${data.results?.join(", ") || "Files written"}`);
    } catch (err) {
      console.error("[Boot.dev Sync] Failed:", err);

      if (
        err.message.includes("Failed to fetch") ||
        err.message.includes("NetworkError")
      ) {
        showToast(
          "Server not running. Start with: npx tsx ./src/server/server.ts",
          true
        );
      } else {
        showToast(`Sync failed: ${err.message}`, true);
      }
    }
  }

  // ============================================================================
  // Button Injection
  // ============================================================================

  function createSyncButton() {
    const button = document.createElement("button");
    button.id = "bootdev-sync-button";
    button.textContent = "Sync to Local";

    // Apply styles from config
    Object.assign(button.style, CONFIG.buttonStyle);

    // Hover effect
    button.addEventListener("mouseenter", () => {
      button.style.backgroundColor = "#059669";
    });
    button.addEventListener("mouseleave", () => {
      button.style.backgroundColor = CONFIG.buttonStyle.backgroundColor;
    });

    // Click handler
    button.addEventListener("click", (e) => {
      e.preventDefault();
      e.stopPropagation();
      syncToLocal();
    });

    return button;
  }

  function injectButton() {
    // Don't inject if already exists
    if (document.getElementById("bootdev-sync-button")) return;

    const button = createSyncButton();

    // Try to find a good injection point
    const selectors = [
      CONFIG.selectors.toolbar,
      '[class*="actions"]',
      '[class*="controls"]',
      "header",
    ];

    for (const selector of selectors) {
      const target = document.querySelector(selector);
      if (target) {
        // If it's a button, insert after it; otherwise append inside
        if (target.tagName === "BUTTON") {
          target.parentNode.insertBefore(button, target.nextSibling);
        } else {
          target.appendChild(button);
        }
        console.log(`[Boot.dev Sync] Button injected near: ${selector}`);
        return;
      }
    }

    // Fallback: create a floating button
    console.log("[Boot.dev Sync] No toolbar found, creating floating button");
    button.style.position = "fixed";
    button.style.top = "10px";
    button.style.right = "10px";
    button.style.zIndex = "10000";
    document.body.appendChild(button);
  }

  // ============================================================================
  // Initialization
  // ============================================================================

  function init() {
    // Initial injection attempt
    injectButton();

    // Re-inject on navigation (SPA routing)
    const observer = new MutationObserver(() => {
      if (!document.getElementById("bootdev-sync-button")) {
        injectButton();
      }
    });

    observer.observe(document.body, {
      childList: true,
      subtree: true,
    });

    // Also listen for URL changes (SPA navigation)
    let lastUrl = location.href;
    setInterval(() => {
      if (location.href !== lastUrl) {
        lastUrl = location.href;
        console.log("[Boot.dev Sync] URL changed, re-injecting button");
        setTimeout(injectButton, 1000);
      }
    }, 1000);
  }

  // Start when DOM is ready
  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init);
  } else {
    init();
  }
})();
