// SPDX-License-Identifier: GPL-3.0-only
// Copyright (C) Inpu contributors
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import viteRawPlugin from 'vite-raw-plugin'

// https://vite.dev/config/
export default defineConfig({
  base: './',
  plugins: [
    react(),
    viteRawPlugin({
      fileRegex: /\.sql$/
    }),
  ],
  //base: "/inpu/"
})
