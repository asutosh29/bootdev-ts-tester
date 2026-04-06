// Write your submission code here!
// Change the imported file names to JS

export class FeatureFlag<T extends string> {
  #flags: Set<T>;

  constructor() {
    this.#flags = new Set<T>();
  }

  enable(flag: T): void {
    this.#flags.add(flag);
  }

  isEnabled(flag: T) {
    return this.#flags.has(flag);
  }
}
