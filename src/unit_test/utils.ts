import assert from "assert";

// Toggle this to true to run the "submitCases" instead of just "runCases"
export const withSubmit = false;
export { assert };

export function describe(description: string, callback: any) {
  console.log(`\n--- ${description} ---`);
  callback();
}

export function it(description: string, callback: any) {
  try {
    callback();
    console.log(`✅ ${description}: Passed\n`);
  } catch (error) {
    if (error instanceof Error) {
      console.error(`❌ ${description}: Failed`);
      console.error(`   ${error.message}\n`);
    }
  }
}
