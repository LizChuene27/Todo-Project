module.exports={
    "collectCoverage": true,
    "collectCoverageFrom": ["src/**/*.{js,jsx}"],
    "coverageDirectory": "coverage",
    "coveragePathIgnorePatterns": [
        "/node_modules/"
      ],
      "setupFilesAfterEnv": ["<rootDir>/jest.setup.js"],
      "testEnvironment": "node" // backend: "node" || frontend: "jsdom"
  }