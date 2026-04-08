/**
 * Boot.dev Local Sync - Configuration
 *
 * This file contains all configurable settings for the extension.
 * Update the filenames and selectors based on your needs.
 */

const CONFIG = {
  // Server endpoint
  serverUrl: "http://localhost:8001/sync",

  // Target filenames to sync
  // These should match the tab/button names on Boot.dev
  files: {
    code: "utils.ts", // The code file to sync
    test: "main_test.ts", // The test file to sync
  },

  // DOM Selectors
  selectors: {
    // Selector to find filename tabs/buttons
    fileTabs: "button",

    // Selector to find all CodeMirror editor instances
    editors: ".cm-content",

    // Where to inject the sync button
    toolbar: '[class*="toolbar"]',
  },

  // Button styling
  buttonStyle: {
    backgroundColor: "#10B981",
    color: "white",
    padding: "8px 16px",
    borderRadius: "6px",
    border: "none",
    cursor: "pointer",
    fontWeight: "600",
    fontSize: "14px",
    marginLeft: "8px",
  },

  // Toast notification styling
  toastStyle: {
    position: "fixed",
    bottom: "20px",
    right: "20px",
    padding: "12px 24px",
    borderRadius: "8px",
    color: "white",
    fontWeight: "500",
    zIndex: "10000",
    transition: "opacity 0.3s ease",
  },
};
