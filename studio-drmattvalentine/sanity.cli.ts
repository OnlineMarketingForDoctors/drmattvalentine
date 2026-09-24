import {defineCliConfig} from 'sanity/cli'

export default defineCliConfig({
  studioHost: 'drmattvalentine',
  api: {
    projectId: 'p6evl32l',
    dataset: 'production'
  },
  deployment: {
    appId: 'rzqulu4algspnljiis91zf05',
    /**
     * Enable auto-updates for studios.
     * Learn more at https://www.sanity.io/docs/studio/latest-version-of-sanity#k47faf43faf56
     */
    autoUpdates: true,
  },
})
