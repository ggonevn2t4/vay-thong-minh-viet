
import { Body, Button, Container, Head, Html, Preview, Section, Text } from 'npm:@react-email/components'
import * as React from 'npm:react@18.3.1'

interface ConfirmationEmailProps {
  confirmationUrl: string
}

export const ConfirmationEmail = ({ confirmationUrl }: ConfirmationEmailProps) => (
  <Html>
    <Head />
    <Preview>Xác nhận tài khoản VayThôngMinh của bạn</Preview>
    <Body style={main}>
      <Container style={container}>
        <Text style={h1}>Chào mừng bạn đến với VayThôngMinh!</Text>
        <Text style={text}>
          Cảm ơn bạn đã đăng ký. Vui lòng nhấp vào nút bên dưới để xác nhận địa chỉ email của bạn và kích hoạt tài khoản.
        </Text>
        <Section style={{ textAlign: 'center' }}>
          <Button style={button} href={confirmationUrl}>
            Xác nhận Email
          </Button>
        </Section>
        <Text style={text}>
          Nếu bạn không đăng ký tài khoản này, vui lòng bỏ qua email này.
        </Text>
        <Text style={footer}>VayThôngMinh - Nền tảng so sánh và tư vấn khoản vay thông minh.</Text>
      </Container>
    </Body>
  </Html>
)

export default ConfirmationEmail

const main = { backgroundColor: '#f6f9fc', fontFamily: 'Arial, sans-serif' }
const container = { backgroundColor: '#ffffff', margin: '0 auto', padding: '20px 0 48px', marginBottom: '64px', border: '1px solid #f0f0f0', borderRadius: '4px' }
const h1 = { color: '#333', fontSize: '24px', fontWeight: 'bold', margin: '40px 0', padding: '0', textAlign: 'center' as const }
const text = { color: '#555', fontSize: '16px', lineHeight: '24px', padding: '0 20px' }
const button = { backgroundColor: '#007bff', borderRadius: '5px', color: '#fff', fontSize: '16px', fontWeight: 'bold', textDecoration: 'none', textAlign: 'center' as const, display: 'inline-block', padding: '12px 24px' }
const footer = { color: '#888', fontSize: '12px', lineHeight: '16px', padding: '0 20px' }

