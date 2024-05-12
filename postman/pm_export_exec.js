require('dotenv').config()
const { exec } = require('child_process')

const args = process.argv.slice(2)
const isProd = args.includes('--prod')

const collectionUID = isProd
  ? process.env.POSTMAN_PROD_COLLECTION_UID
  : process.env.POSTMAN_DEV_COLLECTION_UID

const environmentUID = isProd
  ? process.env.POSTMAN_PROD_ENVIRONMENT_UID
  : process.env.POSTMAN_DEV_ENVIRONMENT_UID

const filePrefix = isProd ? 'prod' : 'dev'

const apiKey = process.env.POSTMAN_API_KEY
const exportCommand = `cross-env \
  API_KEY=${apiKey} \
  COLL_UID=${collectionUID} \
  ENV_UID=${environmentUID} \
  PREFIX=${filePrefix} \
  sh postman/pm_export.sh`

exec(exportCommand, (err, stdout, stderr) => {
  if (err) {
    console.error(`exec error: ${err}`)
    return
  }

  if (stdout) { console.log(`stdout: ${stdout}`) }
  if (stderr) { console.error(`stderr: ${stderr}`) }
})
