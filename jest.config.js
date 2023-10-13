module.exports = {
  setupFilesAfterEnv: [ `@testing-library/jest-dom/extend-expect` ],
  clearMocks: true, 
  testEnvironment: `node`,
  watchPathIgnorePatterns: [
    `node_modules`
  ],
  transform: {
    "^.+\\.[t|j]sx?$": `babel-jest`
  }
};