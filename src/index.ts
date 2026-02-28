import { describe, it, assert, withSubmit } from "./unit_test/utils.js";
import { averageScore } from "./unit_test/run.js";

// Testing code goes here.
describe("averageScore", () => {
  const runCases = [
    {
      ratings: [7, 11, 42],
      expected: 20,
    },
    {
      ratings: [17, 76, 17, 87, 18, 61],
      expected: 46,
    },
  ];
  const submitCases = runCases.concat([
    {
      ratings: [],
      expected: 0,
    },
    {
      ratings: [1111, 1337, 80085],
      expected: 27511,
    },
  ]);

  let testCases = runCases;
  if (withSubmit) {
    testCases = submitCases;
  }

  for (let i = 0; i < testCases.length; i++) {
    // Prevent test case from being undefined
    const testCase = testCases[i];
    if (!testCase) {
      continue;
    }
    const { ratings, expected } = testCase;
    it(`Test ${i}`, () => {
      const actual = averageScore(ratings);
      console.log("Ratings: ", ratings);
      console.log("Expected: ", expected);
      console.log("Actual:   ", actual);
      assert.strictEqual(actual, expected);
    });
    console.log("---------------------------------");
  }

  const numSkipped = submitCases.length - testCases.length;
  if (numSkipped > 0) {
    console.log(`- Skip: ${numSkipped} test case(s) for submit`);
  }
});
