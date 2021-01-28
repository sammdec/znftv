import Box from "@components/Box"

const Footer = () => {
  return (
    <>
      <Box
        css={{ display: "flex", pt: "@2", borderTop: "1px solid @textLight" }}
      >
        <Box as="p" css={{ ml: "auto", my: 0, fontSize: "@0" }}>
          built by{" "}
          <Box
            as="a"
            href="https://twitter.com/sammdec"
            target="_blank"
            css={{ color: "currentcolor" }}
          >
            @sammdec
          </Box>
        </Box>
      </Box>
    </>
  )
}

export default Footer
