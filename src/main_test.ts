import { describe, it, assert, withSubmit } from "./unit_test";
import { getTicketInfo } from "./utils";

type Expect<T extends true> = T;
type Extends<A, B> = A extends B ? true : false;
type NotAny<T> = 0 extends 1 & T ? false : true;
type IsUnion<T, U extends T = T> = boolean extends (
  T extends any ? (U extends T ? false : true) : never
)
  ? true
  : false;

describe("getTicketInfo", () => {
  const runCases = [
    {
      id: 42,
      expected: "Processing ticket: 42",
    },
    {
      id: "SUPPORT-123",
      expected: "Processing ticket: 123",
    },
  ];

  const submitCases = runCases.concat([
    {
      id: 9999,
      expected: "Processing ticket: 9999",
    },
    {
      id: "BACKEND-986",
      expected: "Processing ticket: 986",
    },
  ]);

  it("Function parameter must be a union type of string | number", () => {
    type GetTicketInfoParam = Parameters<typeof getTicketInfo>[0];
    type NotAnyTest = Expect<NotAny<GetTicketInfoParam>>;
    type IsUnionTest = Expect<IsUnion<GetTicketInfoParam>>;
    type ContainsStringAndNumber = Expect<
      Extends<string, GetTicketInfoParam> & Extends<number, GetTicketInfoParam>
    >;

    type RejectsOtherTypes = Expect<
      Extends<boolean extends GetTicketInfoParam ? true : false, false>
    >;

    console.log("✓ Type check passed: proper union type is used");
  });

  let testCases = runCases;
  if (withSubmit) {
    testCases = submitCases;
  }

  for (let i = 0; i < testCases.length; i++) {
    const { id, expected } = testCases[i];
    it(`Test ${i}`, () => {
      const result = getTicketInfo(id);
      console.log(`ID: ${id} (${typeof id})`);
      console.log(`Expected: ${expected}`);
      console.log(`Result: ${result}`);
      assert.strictEqual(result, expected);
    });
    console.log("---------------------------------");
  }

  it("Function should accept both string and number types", () => {
    const result1 = getTicketInfo(123);
    const result2 = getTicketInfo("TEST-456");
    console.log(
      "Type checking passed: function accepts both number and string types",
    );
  });

  const numSkipped = submitCases.length - testCases.length;
  if (numSkipped > 0) {
    console.log(`- Skip: ${numSkipped} test case(s) for submit`);
  }
});
