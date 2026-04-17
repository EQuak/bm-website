import {
  Body,
  Container,
  Head,
  Hr,
  Html,
  Img,
  Section,
  Text
} from "@react-email/components"

function _EmailHeader() {
  return (
    <Section style={headerContainer}>
      <Img
        src={
          "https://cwergvogslzhnsjhfofx.supabase.co/storage/v1/object/public/public_images/true-up.png?width=300&height=100"
        }
        width="330"
        height="100"
        alt="True Up Companies"
        style={headerImage}
      />
      <Hr style={hr} />
    </Section>
  )
}

function EmailFooter() {
  return (
    <Text style={footer}>
      © {new Date().getFullYear()} True Up Companies. All rights reserved.
    </Text>
  )
}

export function EmailTemplate({ children }: { children: React.ReactNode }) {
  return (
    <Html>
      <Head />
      <Body style={body}>
        <Container style={container}>
          {/* <EmailHeader /> */}
          <Section style={content}>{children}</Section>
          <Container style={footerContainer}>
            <Hr style={hr} />
            <EmailFooter />
          </Container>
        </Container>
      </Body>
    </Html>
  )
}

const body = {
  backgroundColor: "#dbddde",
  fontFamily: "Arial,sans-serif"
}

const container = {
  margin: "30px auto",
  backgroundColor: "#fff",
  borderRadius: 5,
  overflow: "hidden"
}

const headerContainer = {
  backgroundColor: "white",
  padding: "20px",
  justifyContent: "center",
  textAlign: "center" as const
}

const headerImage = {
  margin: "0 auto",
  display: "block"
}

const content = {
  backgroundColor: "white",
  padding: "30px 30px 0 30px",
  borderRadius: "4px"
}

const footerContainer = {
  padding: "0 30px"
}

const hr = {
  borderColor: "#e8eaed",
  margin: "10px 0"
}

const footer = {
  textAlign: "center" as const,
  fontSize: "12px",
  color: "#666666"
}
