const BRAND = {
  dark: '#1a1a2e',
  gold: '#c9a227',
  goldLight: '#f5f0e0',
  bg: '#faf9f6',
  text: '#333333',
  muted: '#666666',
  border: '#e5e5e5',
  white: '#ffffff',
  success: '#16a34a',
};

function wrap(content: string): string {
  return `<!DOCTYPE html>
<html lang="en">
<head><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1.0"></head>
<body style="margin:0;padding:0;background-color:${BRAND.bg};font-family:'Segoe UI',Roboto,Helvetica,Arial,sans-serif;">
<table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND.bg};padding:24px 0;">
<tr><td align="center">
<table role="presentation" width="600" cellpadding="0" cellspacing="0" style="max-width:600px;width:100%;background-color:${BRAND.white};border-radius:12px;overflow:hidden;border:1px solid ${BRAND.border};">
${content}
</table>
<p style="margin:16px 0 0;font-size:11px;color:${BRAND.muted};text-align:center;">MGM Financiers Private Limited &bull; Navi Mumbai, India<br/>This is an internal notification. Do not forward.</p>
</td></tr></table>
</body></html>`;
}

function header(title: string): string {
  return `<tr><td style="background-color:${BRAND.dark};padding:24px 32px;">
<h1 style="margin:0;font-size:20px;font-weight:700;color:${BRAND.white};letter-spacing:-0.3px;">${title}</h1>
<p style="margin:4px 0 0;font-size:13px;color:${BRAND.gold};">MGM Financiers</p>
</td></tr>`;
}

function badge(text: string, color: string): string {
  return `<span style="display:inline-block;padding:3px 10px;border-radius:20px;font-size:11px;font-weight:600;color:${BRAND.white};background-color:${color};letter-spacing:0.3px;">${text}</span>`;
}

function row(label: string, value: string): string {
  return `<tr><td style="padding:8px 0;font-size:13px;color:${BRAND.muted};width:140px;vertical-align:top;">${label}</td><td style="padding:8px 0;font-size:13px;color:${BRAND.text};font-weight:500;">${value || '—'}</td></tr>`;
}

function section(title: string, rows: string): string {
  return `<tr><td colspan="2" style="padding:16px 0 8px;font-size:11px;font-weight:700;color:${BRAND.muted};text-transform:uppercase;letter-spacing:0.8px;border-top:1px solid ${BRAND.border};">${title}</td></tr>${rows}`;
}

function footer(): string {
  return `<tr><td style="background-color:${BRAND.bg};padding:16px 32px;border-top:1px solid ${BRAND.border};">
<p style="margin:0;font-size:11px;color:${BRAND.muted};text-align:center;">MGM Financiers Private Limited | RBI-registered NBFC<br/>This email was sent automatically. Please do not reply.</p>
</td></tr>`;
}

export function paymentSuccessEmail(data: {
  customerName: string;
  customerPhone: string;
  amount: number;
  paymentType: string;
  orderId: string;
  paidAt: string;
  paymentMethod: string;
}): string {
  return wrap(
    header('Payment Received') +
    `<tr><td style="padding:24px 32px;">
      <p style="margin:0 0 16px;font-size:14px;color:${BRAND.text};">A payment has been successfully received.</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND.bg};border-radius:8px;padding:4px 16px;border:1px solid ${BRAND.border};">
        <tr><td style="padding:12px 0;">
          <span style="font-size:28px;font-weight:700;color:${BRAND.dark};">₹${data.amount.toLocaleString('en-IN')}</span>
          <span style="margin-left:8px;">${badge('PAID', BRAND.success)}</span>
        </td></tr>
      </table>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:8px;">
        ${section('Payment Details',
          row('Customer', data.customerName) +
          row('Phone', data.customerPhone) +
          row('Type', data.paymentType || 'General') +
          row('Amount', `₹${data.amount.toLocaleString('en-IN')}`) +
          row('Date', data.paidAt)
        )}
        ${section('Transaction',
          row('Order ID', data.orderId) +
          row('Method', data.paymentMethod || 'N/A') +
          row('Status', badge('Successful', BRAND.success))
        )}
      </table>
    </td></tr>` +
    footer()
  );
}

export function grievanceNewEmail(data: {
  grievanceId: string;
  name: string;
  email: string;
  mobile: string;
  category: string;
  subject: string;
  createdAt: string;
}): string {
  return wrap(
    header('New Grievance Received') +
    `<tr><td style="padding:24px 32px;">
      <p style="margin:0 0 16px;font-size:14px;color:${BRAND.text};">A new grievance has been submitted and requires attention.</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND.bg};border-radius:8px;padding:4px 16px;border:1px solid ${BRAND.border};">
        <tr><td style="padding:12px 0;">
          <span style="font-size:16px;font-weight:700;color:${BRAND.dark};">${data.grievanceId}</span>
          <span style="margin-left:8px;">${badge('NEW', BRAND.gold)}</span>
        </td></tr>
      </table>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:8px;">
        ${section('Grievance Details',
          row('Ticket ID', data.grievanceId) +
          row('Subject', data.subject) +
          row('Category', data.category) +
          row('Status', badge('RECEIVED', BRAND.gold))
        )}
        ${section('Customer Information',
          row('Name', data.name) +
          row('Email', data.email) +
          row('Phone', data.mobile)
        )}
        ${section('Submission', row('Date', data.createdAt))}
      </table>
    </td></tr>` +
    footer()
  );
}

export function grievanceUpdateEmail(data: {
  grievanceId: string;
  name: string;
  previousStatus: string;
  newStatus: string;
  updateNote: string;
  updatedAt: string;
}): string {
  const statusColor = data.newStatus === 'RESOLVED' || data.newStatus === 'CLOSED' ? BRAND.success : BRAND.gold;
  return wrap(
    header('Grievance Update') +
    `<tr><td style="padding:24px 32px;">
      <p style="margin:0 0 16px;font-size:14px;color:${BRAND.text};">A grievance has been updated.</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND.bg};border-radius:8px;padding:4px 16px;border:1px solid ${BRAND.border};">
        <tr><td style="padding:12px 0;">
          <span style="font-size:16px;font-weight:700;color:${BRAND.dark};">${data.grievanceId}</span>
          <span style="margin-left:8px;">${badge(data.newStatus, statusColor)}</span>
        </td></tr>
      </table>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:8px;">
        ${section('Update Details',
          row('Ticket ID', data.grievanceId) +
          row('Customer', data.name) +
          row('Previous Status', data.previousStatus) +
          row('New Status', badge(data.newStatus, statusColor)) +
          row('Update', data.updateNote || 'No additional details')
        )}
        ${section('Timestamp', row('Date', data.updatedAt))}
      </table>
    </td></tr>` +
    footer()
  );
}

export function leadNewEmail(data: {
  leadId: string;
  name: string;
  phone: string;
  email: string;
  loanType: string;
  amount: number;
  cibil: string;
  employment: string;
  purpose: string;
  createdAt: string;
}): string {
  return wrap(
    header('New Loan Lead Received') +
    `<tr><td style="padding:24px 32px;">
      <p style="margin:0 0 16px;font-size:14px;color:${BRAND.text};">A new loan application has been submitted through the website.</p>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="background-color:${BRAND.bg};border-radius:8px;padding:4px 16px;border:1px solid ${BRAND.border};">
        <tr><td style="padding:12px 0;">
          <span style="font-size:16px;font-weight:700;color:${BRAND.dark};">${data.leadId}</span>
          <span style="margin-left:8px;">${badge('NEW LEAD', BRAND.gold)}</span>
        </td></tr>
      </table>
      <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="margin-top:8px;">
        ${section('Applicant',
          row('Name', data.name) +
          row('Phone', data.phone) +
          row('Email', data.email || 'Not provided')
        )}
        ${section('Loan Details',
          row('Loan Type', data.loanType) +
          row('Requested Amount', data.amount ? `₹${data.amount.toLocaleString('en-IN')}` : 'N/A') +
          row('CIBIL Score', data.cibil || 'Not provided') +
          row('Employment', data.employment || 'Not provided') +
          row('Purpose', data.purpose || 'Not provided')
        )}
        ${section('Submission', row('Date', data.createdAt))}
      </table>
    </td></tr>` +
    footer()
  );
}
