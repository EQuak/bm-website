import { Container, Text } from "@react-email/components"

import { container, heading, paragraph } from "../_components/email-styles"
import { EmailTemplate } from "../_components/email-template"

interface DeactivatedUserEmailProps {
  email: string
  firstName: string
  lastName: string
  deactivationDateTime: string
  reason?: string
}

export const DeactivatedUserEmail = ({
  firstName,
  lastName,
  deactivationDateTime,
  reason
}: DeactivatedUserEmailProps) => {
  return (
    <EmailTemplate>
      <Text style={heading}>Account Deactivation Notice</Text>
      <Text style={paragraph}>
        Dear {firstName} {lastName},
      </Text>
      <Text style={paragraph}>
        We regret to inform you that your True Up Companies account has been
        deactivated.
      </Text>
      <Container style={{ ...container, padding: "15px", textAlign: "left" }}>
        <Text style={{ margin: "5px 0" }}>
          <b>Account Details:</b>
        </Text>
        <Text style={{ margin: "5px 0" }}>
          Name: {firstName} {lastName}
        </Text>
        <Text style={{ margin: "5px 0" }}>
          Deactivation Date/Time: {deactivationDateTime}
        </Text>
        <Text style={{ margin: "5px 0" }}>
          Reason for deactivation: {reason}
        </Text>
      </Container>
      <Text style={paragraph}>
        As a result of this deactivation, you will no longer be able to log in
        to the True Up Companies platform.
      </Text>
      <Text style={paragraph}>
        If you believe this is a mistake or need further information, please
        contact our support team for assistance.
      </Text>
      <Text style={paragraph}>
        If you have any questions or need assistance, please don't hesitate to
        contact our support team.
      </Text>
      <Text style={paragraph}>Thank you for your understanding.</Text>
    </EmailTemplate>
  )
}

DeactivatedUserEmail.PreviewProps = {
  email: "john.doe@example.com",
  firstName: "John",
  lastName: "Doe",
  deactivationDateTime: "2024-01-01 12:00:00",
  reason: "Account was deactivated due to inactivity"
}

export default DeactivatedUserEmail
