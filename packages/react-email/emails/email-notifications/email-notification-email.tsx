import { Button, Text } from "@react-email/components"

import { heading, paragraph } from "../_components/email-styles"
import { EmailTemplate } from "../_components/email-template"

interface EmailNotificationEmailProps {
  message: string
  subject: string
  link?: string
}

export const EmailNotificationEmail = ({
  message,
  subject,
  link
}: EmailNotificationEmailProps) => {
  return (
    <EmailTemplate>
      <Text style={heading}>{subject}</Text>
      <div
        style={{ ...paragraph, wordBreak: "break-word" as const }}
        dangerouslySetInnerHTML={{ __html: message }}
      />
      {link && <Button href={link}>View</Button>}
    </EmailTemplate>
  )
}

EmailNotificationEmail.PreviewProps = {
  message:
    "<p>ewwfewfewfewfewfweqfewfewqfewqfewfewfewfewewffewfwqfew<br><br>regregregreggegregergesgregersgresgers<br><br>regre;kmgrekmgklremglremlkremkremgrkemglremglremgklremgeknglregnrlegnrelkgnrelkgnrelknglrgrekngregnlrengioregnongoirenglrgniorenglrkegnroiegnrelknglkrenglkregnoingrelgn<br><br>ewwfewfewfewfewfweqfewfewqfewqfewfewfewfewewffewfwqfew<br><br>regregregreggegregergesgregersgresgers<br><br>regre;kmgrekmgklremglremlkremkremgrkemglremglremgklremgeknglregnrlegnrelkgnrelkgnrelknglrgrekngregnlrengioregnongoirenglrgniorenglrkegnroiegnrelknglkrenglkregnoingrelgnewwfewfewfewfewfweqfewfewqfewqfewfewfewfewewffewfwqfew<br><br>regregregreggegregergesgregersgresgers<br><br>regre;kmgrekmgklremglremlkremkremgrkemglremglremgklremgeknglregnrlegnrelkgnrelkgnrelknglrgrekngregnlrengioregnongoirenglrgniorenglrkegnroiegnrelknglkrenglkregnoingrelgnewwfewfewfewfewfweqfewfewqfewqfewfewfewfewewffewfwqfew<br><br>regregregreggegregergesgregersgresgers<br><br>regre;kmgrekmgklremglremlkremkremgrkemglremglremgklremgeknglregnrlegnrelkgnrelkgnrelknglrgrekngregnlrengioregnongoirenglrgniorenglrkegnroiegnrelknglkrenglkregnoingrelgnewwfewfewfewfewfweqfewfewqfewqfewfewfewfewewffewfwqfew<br><br>regregregreggegregergesgregersgresgers<br><br>regre;kmgrekmgklremglremlkremkremgrkemglremglremgklremgeknglregnrlegnrelkgnrelkgnrelknglrgrekngregnlrengioregnongoirenglrgniorenglrkegnroiegnrelknglkrenglkregnoingrelgnewwfewfewfewfewfweqfewfewqfewqfewfewfewfewewffewfwqfew<br><br>regregregreggegregergesgregersgresgers<br><br>regre;kmgrekmgklremglremlkremkremgrkemglremglremgklremgeknglregnrlegnrelkgnrelkgnrelknglrgrekngregnlrengioregnongoirenglrgniorenglrkegnroiegnrelknglkrenglkregnoingrelgn</p>",
  subject: "Email Subject"
}

export default EmailNotificationEmail
