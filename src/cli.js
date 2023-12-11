#!/usr/bin/env node

import yargs from 'yargs'
import { hideBin } from 'yargs/helpers'
import { annotateFile } from './index.js'

const argv = yargs(hideBin(process.argv))
  .usage('Annotate file with IPSS-M and IPSS-R.\n\nUsage: $0 <inputFile> <outputFile>')
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
    }
  )
  .demandCommand(2, 'You need to provide an inputFile and an outputFile.')
  .epilogue(`More help:\n\r\rIt supports .csv, .tsv, .xlsx files.\n\r\rSee input reference: https://github.com/papaemmelab/ipssm-js#inputs\n\r\rIPSS-M paper: https://evidence.nejm.org/doi/full/10.1056/EVIDoa2200008`)
  .example('$0 in.xlsx out.xlsx', 'annotate a xlsx file.')
  .example('$0 in.csv out.csv', 'annotate a csv file.')
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