import { describe, it, assert, withSubmit } from "./unit_test";
import { MailPreferences, setPreference } from "./utils";

describe("setPreference", () => {
  const runCases: {
    preferences: MailPreferences;
    key: string;
    value: boolean;
    expected: boolean;
  }[] = [
    {
      preferences: {
        darkMode: true,
        outOfOffice: true,
        doNotDisturb: true,
      },
      key: "darkMode",
      value: false,
      expected: true,
    },
    {
      preferences: {
        outOfOffice: false,
        doNotDisturb: true,
      },
      key: "autoReply",
      value: true,
      expected: false,
    },
  ];

  const submitCases = runCases.concat([
    {
      preferences: {},
      key: "markUnread",
      value: true,
      expected: false,
    },
    {
      preferences: {
        attachSignature: true,
        formatOnSave: true,
      },
      key: "formatOnSave",
      value: false,
      expected: true,
    },
  ]);

  let testCases = runCases;
  if (withSubmit) {
    testCases = submitCases;
  }

  for (let i = 0; i < testCases.length; i++) {
    const { preferences, key, value, expected } = testCases[i];
    it(`Test ${i}`, () => {
      console.log("Inputs:");
      console.log("- Mail Preferences:");
      for (const pref in preferences) {
        console.log(`  - ${pref}: ${preferences[pref]}`);
      }
      console.log("- Key:", key);
      const result = setPreference(preferences, key, value);
      console.log("- Value:", value);
      console.log("Expected:", expected);
      console.log("Actual:  ", result);
      assert.strictEqual(result, expected);
    });
    console.log("---------------------------------");
  }

  const numSkipped = submitCases.length - testCases.length;
  if (numSkipped > 0) {
    console.log(`- Skip: ${numSkipped} test case(s) for submit`);
  }
});
