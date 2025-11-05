interface ImportMetaEnv {
  readonly VITE_BACKEND_URL: string
  readonly VITE_TENANT: string
  // more env variables...
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}