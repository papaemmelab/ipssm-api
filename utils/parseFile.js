import { promises as fs } from 'fs'
import Papa from 'papaparse'
import Excel from 'exceljs'

const parseCsv = async (filePath) => {
    const dataString = await fs.readFile(filePath, 'utf-8')
    const { data } = Papa.parse(dataString, { header: true, skipEmptyLines: true })
    return data
}


const parseXlsx = async (filePath) => {
    const workbook = new Excel.Workbook()
    await workbook.xlsx.readFile(filePath)
    
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
    return data
}

export { parseCsv, parseXlsx }