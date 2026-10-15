import base from '@lnu/eslint-config'
import browser from '@lnu/eslint-config/browser'
import jsdoc from '@lnu/eslint-config/jsdoc'

export default [
  { ignores: ['dist/'] },
  ...base,
  ...browser,
  ...jsdoc
]
