import axios from 'axios'
import FormData from 'form-data'
import { fromBuffer } from 'file-type'
const SIGNATURE = 'ZXRoLTB4ZmUxOGFhMWVmYTY1MjY2MGYzNmFiODRmMTIyY2QzNjEwOGY5MDNiNjoweDA3YTQxM2NkYjY4MDEzYWMxNzRhOWQwN2VkMDY5NWY4ZWQwNTI3MmYyYWFmZTc0OTJmZWMxOTA3MTVmM2RjYmQwYmUyNjQ2OTI3MTlhNTYwZWQ3NzUzYTJiZTlhMTVkNmJjOTYwNzFkOWY0MzVmNzg4YTliOTExZjQxZDk3N2IzMWM='

export async function uploadToIpfsCrust (content, name, token) {
  const mAuth = !token ? SIGNATURE : token
  const f = new FormData()
  const isBase64 = typeof content === 'string'
  // const buffer = await new Blob([content]).arrayBuffer()
  const buffer = isBase64 ? Buffer.from(content.replace('data:image/png;base64,', ''), 'base64') : Buffer.from(content)
  const types = await fromBuffer(buffer)
  const type = !types ? 'image/png' : types.mime
  f.append('file', buffer, { filename: name, type: type })
  const length = await f.getLengthSync()
  const res = await axios.post('https://gw.crustapps.net/api/v0/add?pin=true', f, {
    headers: {
      ...f.getHeaders(),
      'content-length': length,
      Authorization: `Basic ${mAuth}`
    }
  })
  await axios.post('https://pin.crustcode.com/psa/pins', {}, {
    headers: {
      Authorization: `Bearer ${mAuth}`
    }
  }).catch(console.error)
  return { ...res.data, download_url: `https://gw.crustapps.net/ipfs/${res.data.Hash}` }
}
