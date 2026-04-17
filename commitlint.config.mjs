export default {
  extends: ["@commitlint/config-conventional"],
  rules: {
    "type-enum": [
      2,
      "always",
      [
        "feat",
        "fix",
        "docs",
        "style",
        "refactor",
        "test",
        "chore",
        "perf",
        "ci",
        "build",
        "revert"
      ]
    ],
    "type-case": [2, "always", "lower-case"],
    "type-empty": [2, "never"],
    // Allow sentence case, lower case, start case, or capitalized words for subject
    "subject-case": [0, "never"],
    "subject-empty": [2, "never"],
    "subject-full-stop": [0],
    "body-leading-blank": [2, "always"],
    "body-max-line-length": [0],
    // Allow subject line up to 300 characters
    "header-max-length": [2, "always", 300]
  }
}
