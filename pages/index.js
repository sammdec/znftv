import { useState } from "react"
import { useMutation } from "react-query"
import Box from "@components/Box"
import InlineCode from "@components/InlineCode"
import Check from "@components/Check"
import Cross from "@components/Cross"
import Loading from "@components/Loading"
import Footer from "@components/Footer"
import LoadingBox from "@components/LoadingBox"

import tokenQuery from "@utils/tokenQuery"
import useSha256Hash from "@utils/useSha256Hash"

export default function Home() {
  const [tokenId, setTokenId] = useState("")

  const {
    mutate,
    data,
    isSuccess: dataSuccess,
    reset: dataReset,
  } = useMutation(["token", tokenId], () => tokenQuery(tokenId), {
    onSuccess: (data) => {
      contentMutate(data)
      metadataMutate(data)
    },
  })

  const {
    mutate: contentMutate,
    data: onChainContent,
    isSuccess: contentSuccess,
    reset: contentReset,
  } = useMutation(["content", tokenId], async (data) => {
    const r = await fetch(data?.media?.contentURI)
    return await r.arrayBuffer()
  })

  const {
    mutate: metadataMutate,
    data: onChainMetadata,
    isSuccess: metadataSuccess,
    reset: metadataReset,
  } = useMutation(["metadata", tokenId], async (data) => {
    const r = await fetch(data?.media?.metadataURI)
    return await r.arrayBuffer()
  })

  const derivedContentHash = useSha256Hash(onChainContent)
  const derivedMetadataHash = useSha256Hash(onChainMetadata)

  const contentMatches = derivedContentHash === data?.media?.contentHash
  const metadataMatches = derivedMetadataHash === data?.media?.metadataHash

  const handleVerify = (e) => {
    const { value } = e.target
    setTokenId(value)
    if (value.length === 0) {
      dataReset()
      metadataReset()
      contentReset()
    }
  }

  return (
    <Box as="main" css={{ maxWidth: 740, mx: "auto", py: "@3", px: "@2" }}>
      <Box
        as="h1"
        css={{
          fontSize: "@4",
          fontFamily: "@body",
          fontWeight: 700,
          textAlign: "center",
          m: 0,
          mb: "@1",
        }}
      >
        Zora NFT Validator
      </Box>
      <Box as="p" css={{ fontWeight: 700, fontSize: "@2" }}>
        What is this?
      </Box>
      <Box as="p">
        This tool allows you to securely authenticate the validity of a NFT
        minted by the Zora Protocol, by checking that the content and metadata
        files in this token are in fact the data that was originally written to
        the token at minting.
      </Box>
      <Box as="p">
        If the hashes do not match it means that at some point during the
        lifetime of this token an owner has changed the{" "}
        <InlineCode>tokenURI</InlineCode> or{" "}
        <InlineCode>metadataURI</InlineCode> to point to different content.
      </Box>
      <Box as="p" css={{ fontWeight: 700, fontSize: "@2" }}>
        What is the Zora Protocol?
      </Box>
      <Box as="p">
        Content minted on the Zora protocol stores both a URL to the content and
        the metadata and also a SHA-256 hash of the content and metadata, both
        are created at minting but only the URL can be updated.
      </Box>
      <Box as="p">
        This means that content and metadata locations can be moved to new
        storage solutions but the hashes verify that the content found at those
        locations is the same as the day it was minted. This ensures uniqueness
        of the content stored, therefore enforcing validitiy of the provenance
        of the content.
      </Box>
      <Box as="p">
        More information about the Zora Protocol can be found by reading the{" "}
        <Box
          as="a"
          href="https://zora.engineering/whitepaper"
          target="_blank"
          css={{ color: "currentcolor" }}
        >
          Whitepaper
        </Box>
      </Box>

      <Box css={{ borderBottom: "1px solid @textLight", my: "@4" }} />

      <Box css={{ display: "flex", alignItems: "flex-end", mb: "@3" }}>
        <Box
          css={{
            display: "flex",
            flexDirection: "column",
          }}
        >
          <Box as="label" css={{ fontWeight: 700, mb: "@0" }}>
            Enter the token ID to validate
          </Box>
          <Box
            as="input"
            type="search"
            value={tokenId}
            onChange={handleVerify}
            css={{
              fontFamily: "@mono",
              fontSize: "@1",
              px: "@1",
              py: "@0",
              border: "1px solid @text",
              borderRadius: 5,
            }}
          />
        </Box>
        <Box
          as="button"
          css={{
            appearance: "none",
            display: "inline-flex",
            border: "none",
            borderRadius: 5,
            backgroundColor: "@text",
            color: "@bg",
            px: "@3",
            py: "@1",
            textDecoration: "none",
            fontWeight: 700,
            ml: "@2",
            cursor: "pointer",
            transition: "opacity 0.2s ease-in-out",
            "&:hover": {
              opacity: 0.8,
            },
          }}
          onClick={() => mutate()}
        >
          Verify
        </Box>
      </Box>
      {dataSuccess && !data?.media && (
        <Box css={{ mb: "@3" }}>A token with this ID doesn't exist yet</Box>
      )}

      {dataSuccess && tokenId.length > 0 && data?.media && (
        <>
          <Box css={{ mb: "@4" }}>
            <Box css={{ display: "flex", alignItems: "center", mb: 0 }}>
              <Box
                as="span"
                css={{
                  display: "inline-block",
                  width: 32,
                  mr: "@1",
                  color: !contentSuccess
                    ? "@textLight"
                    : contentMatches
                    ? "@check"
                    : "@cross",
                }}
              >
                {!contentSuccess ? (
                  <Loading />
                ) : contentMatches ? (
                  <Check />
                ) : (
                  <Cross />
                )}
              </Box>
              <Box as="p" css={{ fontWeight: 700, my: "@0" }}>
                {!contentSuccess && "Calculating"} Content Hash
              </Box>
            </Box>

            {!contentSuccess ? (
              <LoadingBox css={{ mt: 0, ml: "@5" }} />
            ) : contentMatches ? (
              <Box as="p" css={{ mt: 0, pl: "@5" }}>
                The contents of the <InlineCode>contentURI</InlineCode> found
                on-chain <strong>matches</strong> the immutable{" "}
                <InlineCode>contentHash</InlineCode> that was created at
                minting.
              </Box>
            ) : (
              <Box as="p" css={{ mt: 0, pl: "@5" }}>
                The contents of the <InlineCode>contentURI</InlineCode> found
                on-chain <strong>does not match</strong> the immutable{" "}
                <InlineCode>contentHash</InlineCode> that was created at
                minting.
              </Box>
            )}
          </Box>
          <Box css={{ mb: "@4" }}>
            <Box css={{ display: "flex", alignItems: "center", mb: 0 }}>
              <Box
                as="span"
                css={{
                  display: "inline-block",
                  width: 32,
                  mr: "@1",
                  color: !metadataSuccess
                    ? "@textLight"
                    : metadataMatches
                    ? "@check"
                    : "@cross",
                }}
              >
                {!metadataSuccess ? (
                  <Loading />
                ) : metadataMatches ? (
                  <Check />
                ) : (
                  <Cross />
                )}
              </Box>
              <Box as="p" css={{ fontWeight: 700, my: "@0" }}>
                {!metadataSuccess && "Calculating"} Metadata Hash
              </Box>
            </Box>

            {!metadataSuccess ? (
              <LoadingBox css={{ mt: 0, ml: "@5" }} />
            ) : metadataMatches ? (
              <Box as="p" css={{ mt: 0, pl: "@5" }}>
                The content of the <InlineCode>metadataURI</InlineCode> found
                on-chain <strong>matches</strong> the immutable{" "}
                <InlineCode>metadataHash</InlineCode> that was created at
                minting.
              </Box>
            ) : (
              <Box as="p" css={{ mt: 0, pl: "@5" }}>
                The content of the <InlineCode>metadataURI</InlineCode> found
                on-chain <strong>does not match</strong> the immutable
                <InlineCode>metadataHash</InlineCode> that was created at
                minting.
              </Box>
            )}
          </Box>
        </>
      )}

      <Footer />
    </Box>
  )
}
