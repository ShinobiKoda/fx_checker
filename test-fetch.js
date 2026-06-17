async function run() {
  try {
    const res = await fetch('https://api.frankfurter.app/latest?from=USD')
    if (!res.ok) throw new Error('Failed ' + res.statusText)
    const json = await res.json()
    console.log('Success:', Object.keys(json.rates).length, 'rates')
  } catch (err) {
    console.error('Error:', err)
  }
}
run()
