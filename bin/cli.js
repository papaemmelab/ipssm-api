#!/usr/bin/env node

import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { annotateFile } from '../index.js'

const argv = yargs(hideBin(process.argv))
  .usage('Usage: $0 <inputFile> <outputFile>')
  .command(
    '$0 <inputFile> <outputFile>', 
    'Annotate with IPSS-M and IPSS-R a file with patients.', 
    (yargs) => {
      yargs
        .positional('inputFile', {
          describe: 'File to be annotated (rows: patients, columns: variables).',
          type: 'string'
        })
        .positional('outputFile', {
          describe: 'Path for the annotated output file.',
          type: 'string'
        })
  })
  .demandCommand(2, 'You need to provide an inputFile and an outputFile.')
  .epilogue(`Annotate a file of patients with IPSS-M and IPSS-R risk scores and categories. It supports .csv, .tsv, .xlsx files.`)
  .help('h')
  .alias('h', 'help')
  .argv

(async () => {
  try {
    await annotateFile(argv.inputFile, argv.outputFile)
    console.log('File annotated successfully.')
  } catch (error) {
    console.error('Error annotating file:', error.message)
  }
})()