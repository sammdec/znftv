import { request, gql } from "graphql-request"

const query = gql`
  query getMedia($id: String) {
    media(id: $id) {
      id
      contentHash
      metadataHash
      contentURI
      metadataURI
      owner {
        id
      }
    }
  }
`

export default async function tokenQuery(id) {
  const res = await request(
    "https://api.thegraph.com/subgraphs/name/ourzora/zora-v1",
    query,
    { id }
  )

  if (res.error) return Promise.reject(res)
  return res
}
