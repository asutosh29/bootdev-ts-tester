import { describe, it, assert, withSubmit } from "./unit_test";
import { interpolateComment } from "./utils";

describe("appendComment", () => {
  const runCases = [
    {
      id: 418,
      comment: "Refresh token is missing",
      comments: ["salmon discount code", 418, "I can't remember my email", 420],
      expected: [
        "salmon discount code",
        "Refresh token is missing",
        "I can't remember my email",
        420,
      ],
    },
    {
      id: 42,
      comment: "will gippity be my gf?",
      comments: ["add scarlett johansson voice option", "it's not its", 42],
      expected: [
        "add scarlett johansson voice option",
        "it's not its",
        "will gippity be my gf?",
      ],
    },
  ];

  const submitCases = runCases.concat([
    {
      id: 42,
      comment: "How many roads must a man walk down?",
      comments: [42, "What's yellow and dangerous?", 42],
      expected: [
        "How many roads must a man walk down?",
        "What's yellow and dangerous?",
        42,
      ],
    },
    {
      id: 0,
      comment: "Database is encrypted",
      comments: [
        "How can I pay with my archmage coin?",
        79,
        "the wizard bear isn't wearing pants",
        81,
      ],
      expected: [
        "How can I pay with my archmage coin?",
        79,
        "the wizard bear isn't wearing pants",
        81,
      ],
    },
  ]);

  let testCases = runCases;
  if (withSubmit) {
    testCases = submitCases;
  }

  for (let i = 0; i < testCases.length; i++) {
    const { id, comment, comments, expected } = testCases[i];
    it(`Test ${i}`, () => {
      console.log("Inputs:");
      console.log("- Id: ", id);
      console.log("- Comment: ", comment);
      console.log("- Comments:");
      comments.forEach((item) => {
        console.log(`  - ${item}`);
      });

      interpolateComment(id, comment, comments);

      console.log("Expected:");
      expected.forEach((item) => {
        console.log("- ", item);
      });
      console.log("Actual:");
      comments.forEach((item) => {
        console.log("- ", item);
      });

      assert.deepEqual(expected, comments);
    });
    console.log("---------------------------------");
  }

  const numSkipped = submitCases.length - testCases.length;
  if (numSkipped > 0) {
    console.log(`- Skip: ${numSkipped} test case(s) for submit`);
  }
});
