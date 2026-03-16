import { defineConfig } from 'vite-plus';

export default defineConfig({
  test: {
    globals: true,
    include: ['test/**/*.test.ts', 'test/**/*.test.todo.ts'],
    // exclude: ['test/**/*.test.todo.ts'],
  },
  pack: {
    outDir: 'lib',
    format: ['esm', 'cjs', 'iife'],
    globalName: 'EasyMap',
    minify: true,
    dts: true,
  },
});
