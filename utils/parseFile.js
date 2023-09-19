import fs, { promises as asyncFs } from 'fs'
import Papa from 'papaparse'
import Excel from 'exceljs'

// Coerce numeric values to numbers
const coerceNumeric = (patients) => {
  return patients.map((patient) => {
    return Object.fromEntries(
      Object.entries(patient).map(([header, value]) => [
        header, isNaN(value) ? value : Number(value),
      ])
    )
  })
}

// Read csv or tsv file
const parseCsv = async (inputFile) => {
  const dataString = await asyncFs.readFile(inputFile, 'utf-8')
  const { data } = Papa.parse(dataString, { header: true, skipEmptyLines: true })
  return coerceNumeric(data)
}

// Read xlsx file
const parseXlsx = async (inputFile) => {
  const workbook = new Excel.Workbook()
  await workbook.xlsx.readFile(inputFile)
  
  let jsonData = []
  workbook.eachSheet((worksheet, sheetId) => {
      let sheetData = []
      let headers = []
      worksheet.eachRow({ includeEmpty: false }, (row, rowNumber) => {
          // If first row, consider it as header
          if (rowNumber === 1) {
              headers = row.values.slice(1)
              return
          }
          // Create an object based on the header and row data
          const rowData = {}
          row.values.slice(1).forEach((value, index) => {
              rowData[headers[index]] = value
          })
          sheetData.push(rowData)
      })
      jsonData.push({sheet: worksheet.name, data: sheetData})
  })

  // Find Worksheet with Patient Data
  let data = null
  const expectedKeys = ['BM_BLAST', 'HB', 'PLT']
  jsonData.forEach((sheet) => {
      if (expectedKeys.every(key => sheet.data[0].hasOwnProperty(key))) {
          data = sheet.data
      }
  })
  return coerceNumeric(data)
}

// Write annotated csv file
const writeCsv = async (outputFile, data) => {
  const csvString = Papa.unparse(data)
  fs.writeFileSync(outputFile, csvString, 'utf-8')

  if (!fs.existsSync(outputFile)) {
    throw new Error(`Unable to write file ${outputFile}`)
  }
}

// Write annotated xlsx file
const writeXlsx = async (outputFile, data) => {
  const workbook = new Excel.Workbook()
  const worksheet = workbook.addWorksheet('Sheet 1')

  // Assuming `data` is an array of objects with consistent keys
  const headers = Object.keys(data[0])
  worksheet.addRow(headers)

  // Add the rows from data
  data.forEach(item => {
    worksheet.addRow(headers.map(header => item[header]))
  })

  await workbook.xlsx.writeFile(outputFile)

  if (!fs.existsSync(outputFile)) {
    throw new Error(`Unable to write file ${outputFile}`)
  }
}
export { parseCsv, parseXlsx, writeCsv, writeXlsx }