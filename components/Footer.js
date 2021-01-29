import Box from "@components/Box"

const Footer = () => {
  return (
    <Box
      css={{
        gridColumn: "1/span 2",
        display: "flex",
        flexDirection: "column",
        pt: "@2",
      }}
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
      <Box as="p" css={{ ml: "auto", my: 0, fontSize: "@0" }}>
        sammdec.eth
      </Box>
    </Box>
  )
}

export default Footer
