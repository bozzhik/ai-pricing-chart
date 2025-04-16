export function parseCsv(csvString: string) {
  // Split the CSV string into lines
  const lines = csvString.trim().split('\n')

  // Extract headers (first line)
  const headers = lines[0].split(',')

  // Process data rows
  const data = lines.slice(1).map((line) => {
    const values = line.split(',')
    const row: Record<string, string> = {}

    headers.forEach((header, index) => {
      row[header] = values[index]
    })

    return row
  })

  return data
}
