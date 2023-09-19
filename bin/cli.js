import Excel from 'exceljs'

const getDataFromExcelFile = async fileName => {
    const workbook = new Excel.Workbook()
    await workbook.xlsx.readFile(fileName).then(() => {
        let data = []
        workbook.eachSheet((worksheet) => {
            let headers = {}

            for (let i=1; i <= workbook.actualColumnCount; i++) {
                headers[i] = worksheet.getRow(1).getCell(i).value
            }
            for (let x=2; x <= workbook.actualRowCount; x++) {
                let row = {}
                for (let y=1; x <= workbook.actualColumnCount; x++) {
                    row[headers[y]] = worksheet.getRow(x).getCell(y).value
                }
                data.push(row)
            }
        })
    }).catch(err => {
        console.err(err.message)
        throw err
    })
}

getDataFromExcelFile('test/data/IPSSMexample.xlsx')