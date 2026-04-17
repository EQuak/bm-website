import { Button, Container, Text } from "@react-email/components"

import {
  button,
  container,
  heading,
  paragraph
} from "../_components/email-styles"
import { EmailTemplate } from "../_components/email-template"

interface ReactivatedUserEmailProps {
  email: string
  firstName: string
  lastName: string
  reactivationDateTime: string
  loginUrl: string
}

export const ReactivatedUserEmail = ({
  email,
  firstName,
  lastName,
  reactivationDateTime,
  loginUrl
}: ReactivatedUserEmailProps) => {
  return (
    <EmailTemplate>
      <Text style={heading}>Account Reactivation Notice</Text>
      <Text style={paragraph}>
        Dear {firstName} {lastName},
      </Text>
      <Text style={paragraph}>
        We are pleased to inform you that your True Up Companies account has
        been reactivated.
      </Text>
      <Container
        style={{
          ...container,
          padding: "15px",
          textAlign: "left"
        }}
      >
        <Text style={{ margin: "5px 0", fontWeight: "bold" }}>
          Account Details:
        </Text>
        <Text style={{ margin: "5px 0" }}>
          Name: {firstName} {lastName}
        </Text>
        <Text style={{ margin: "5px 0" }}>Email: {email}</Text>
        <Text style={{ margin: "5px 0" }}>
          Reactivation Date/Time: {reactivationDateTime}
        </Text>
      </Container>
      <Container style={{ textAlign: "center" }}>
        <Button href={loginUrl} style={button}>
          Log In Now
        </Button>
      </Container>
      <Text style={paragraph}>
        If you have any questions or need assistance, please don't hesitate to
        contact our support team.
      </Text>
      <Text style={paragraph}>Welcome back to True Up Companies!</Text>
    </EmailTemplate>
  )
}

ReactivatedUserEmail.PreviewProps = {
  email: "john.doe@example.com",
  firstName: "John",
  lastName: "Doe",
  reactivationDateTime: "2024-01-01 12:00:00",
  loginUrl: "https://example.com/login"
}

export default ReactivatedUserEmail
