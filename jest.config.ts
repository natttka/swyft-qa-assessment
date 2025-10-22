
export default {
  preset: 'ts-jest/presets/default-esm',
  testEnvironment: 'node',
  roots: ['<rootDir>/src'],
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { useESM: true }],
  },
  moduleFileExtensions: ['ts', 'tsx', 'js', 'mjs', 'cjs'],
  collectCoverage: true,
  coverageDirectory: 'coverage',
    globals: {
    'ts-jest': {
      tsconfig: 'tsconfig.jest.json'
    }
  }
};
