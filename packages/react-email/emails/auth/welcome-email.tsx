import { Button, Container, Text } from "@react-email/components"

import {
  button,
  container,
  heading,
  paragraph
} from "../_components/email-styles"
import { EmailTemplate } from "../_components/email-template"

interface WelcomeEmailProps {
  firstName: string
  lastName: string
  email: string
  loginUrl: string
  password?: string
}

export const WelcomeEmail = ({
  firstName,
  lastName,
  email,
  loginUrl,
  password
}: WelcomeEmailProps) => {
  return (
    <EmailTemplate>
      <Text style={heading}>Welcome to True Up Companies!</Text>
      <Text style={paragraph}>
        Hello {firstName} {lastName},
      </Text>
      <Text style={paragraph}>
        Your account has been successfully created. We're excited to have you on
        board!
      </Text>
      <Text style={paragraph}>
        <b>Here are your login details:</b>
      </Text>
      <Container style={container}>
        <Text style={{ ...paragraph, fontWeight: "bold", marginBottom: "0px" }}>
          Email:
        </Text>
        <Text
          style={{
            ...paragraph,
            fontWeight: "bold",
            color: "#393939",
            fontSize: "16px",
            marginTop: "0px"
          }}
        >
          {email}
        </Text>
      </Container>
      <Container style={container}>
        <Text
          style={{
            ...paragraph,
            fontWeight: "bold",
            marginBottom: "0px"
          }}
        >
          Password:
        </Text>
        <Text
          style={{
            ...paragraph,
            fontWeight: "bold",
            color: "#393939",
            fontSize: "16px",
            marginTop: "0px"
          }}
        >
          {password}
        </Text>
      </Container>
      <Text style={paragraph}>
        <b>You should change your password after logging in.</b>
      </Text>
      <Container style={{ textAlign: "center" }}>
        <Button href={loginUrl} style={button}>
          Log In Now
        </Button>
      </Container>
      <Text style={paragraph}>
        If you have any questions or need assistance, please don't hesitate to
        contact our support team.
      </Text>
      <Text style={paragraph}>Welcome aboard!</Text>
    </EmailTemplate>
  )
}

WelcomeEmail.PreviewProps = {
  firstName: "John",
  lastName: "Doe",
  email: "john.doe@example.com",
  loginUrl: "https://example.com/login",
  password: "password123"
}

export default WelcomeEmail
