import { useEffect, useState } from "react"
import sjcl from "sjcl"

function bufferToHex(buffer) {
  return [...new Uint8Array(buffer)]
    .map((b) => b.toString(16).padStart(2, "0"))
    .join("")
}

export default function useSha256Hash(value) {
  const [hash, setHash] = useState(null)
  useEffect(() => {
    if (!value) return
    async function generateHash() {
      const hex = bufferToHex(value)
      const bitArray = sjcl.codec.hex.toBits(hex)
      const hashArray = sjcl.hash.sha256.hash(bitArray)
      const hash = "0x".concat(sjcl.codec.hex.fromBits(hashArray))
      setHash(hash)
    }
    generateHash()
  }, [value])

  return hash
}
