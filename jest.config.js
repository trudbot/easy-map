/** @type {import('ts-jest').JestConfigWithTsJest} */
export default {
  preset: 'ts-jest',
  transform: {
    "^.+\\.[tj]s$": "ts-jest"
  },
  testEnvironment: 'node',
  roots: ['./test', './src'],
};