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
    <Box
      as="main"
      css={{
        maxWidth: 1280,
        mx: "auto",
        py: "@3",
        px: "@3",
        bp0: { display: "grid", gridTemplateColumns: "repeat(2, 1fr)" },
      }}
    >
      <Box
        css={{
          border: "1px solid @text",
          px: "@2",
          py: "@2",
          bp0: { px: "@5", py: "@5" },
        }}
      >
        <Box as="img" src="/zorb.jpg" css={{ maxWidth: 80, mb: 100 }} />
        <Box
          as="h1"
          css={{
            fontSize: "@4",
            fontFamily: "@body",
            fontWeight: 600,
            m: 0,
            mb: "@5",
          }}
        >
          zNFT Validator
        </Box>

        <Box css={{ display: "flex", alignItems: "flex-end", mb: "@5" }}>
          <Box
            as="input"
            type="text"
            value={tokenId}
            onChange={handleVerify}
            placeholder="Enter Token ID"
            css={{
              appearance: "none",
              fontFamily: "@body",
              fontSize: "@1",
              px: "@2",
              py: "@2",
              border: "1px solid @border",
              backgroundColor: "@border",
              outline: "none",
              width: "100%",
              "&:focus, &:active": {
                border: "1px solid @textLight",
              },
            }}
          />

          <Box
            as="button"
            disabled={tokenId.length === 0}
            css={{
              appearance: "none",
              display: "inline-flex",
              border: "1px solid @text",
              backgroundColor: "@text",
              color: "@bg",
              px: "@5",
              py: "@2",
              textDecoration: "none",
              ml: "@2",
              cursor: "pointer",
              transition: "opacity 0.2s ease-in-out",
              fontSize: "@1",
              outline: "none",
              "&:hover": {
                opacity: 0.8,
              },
              "&:disabled": { opacity: 0.6 },
            }}
            onClick={() => mutate()}
          >
            Validate
          </Box>
        </Box>

        <Box as="p">
          This tool allows you to securely authenticate the validity of a NFT
          minted by the{" "}
          <Box
            as="a"
            href="https://zora.engineering/protocol"
            css={{ color: "currentcolor" }}
          >
            Zora protocol
          </Box>
          , by checking that the content and metadata files in this token are in
          fact the data that was originally written to the token at minting.
        </Box>
        <Box as="p">
          If the hashes do not match it means that at some point during the
          lifetime of this token an owner has changed the{" "}
          <InlineCode>tokenURI</InlineCode> or{" "}
          <InlineCode>metadataURI</InlineCode> to point to different content.
        </Box>
      </Box>

      <Box
        css={{
          px: "@2",
          py: "@2",
          display: "flex",
          borderLeft: "1px solid @text",
          borderTop: "none",
          borderRight: "1px solid @text",
          borderBottom: "1px solid @text",
          bp0: {
            px: "@5",
            py: "@5",
            borderLeft: "none",
            borderTop: "1px solid @text",
            borderRight: "1px solid @text",
            borderBottom: "1px solid @text",
          },
        }}
      >
        {dataSuccess && !data?.media && (
          <Box css={{ display: "flex", mx: "auto", my: "auto" }}>
            A token with this ID doesn't exist yet
          </Box>
        )}

        {!dataSuccess && !data?.media && (
          <Box css={{ display: "flex", mx: "auto", my: "auto" }}>
            Enter a token ID to check it's validity
          </Box>
        )}

        {dataSuccess && tokenId.length > 0 && data?.media && (
          <Box
            css={{
              display: "flex",
              flexDirection: "column",
              mx: "auto",
              my: "auto",
            }}
          >
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
                <Box as="p" css={{ fontWeight: 600, my: "@0" }}>
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
            <Box css={{}}>
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
                <Box as="p" css={{ fontWeight: 600, my: "@0" }}>
                  {!metadataSuccess && "Calculating"} Metadata Hash
                </Box>
              </Box>

              {!metadataSuccess ? (
                <LoadingBox css={{ mt: 0, ml: "@5" }} />
              ) : metadataMatches ? (
                <>
                  <Box as="p" css={{ mt: 0, pl: "@5" }}>
                    The content of the <InlineCode>metadataURI</InlineCode>{" "}
                    found on-chain <strong>matches</strong> the immutable{" "}
                    <InlineCode>metadataHash</InlineCode> that was created at
                    minting.
                  </Box>
                </>
              ) : (
                <Box as="p" css={{ mt: 0, pl: "@5" }}>
                  The content of the <InlineCode>metadataURI</InlineCode> found
                  on-chain <strong>does not match</strong> the immutable
                  <InlineCode>metadataHash</InlineCode> that was created at
                  minting.
                </Box>
              )}
            </Box>
          </Box>
        )}
      </Box>

      <Footer />
    </Box>
  )
}
