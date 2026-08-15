// src/shared/templates/password-reset.ts
export function passwordResetTemplate(resetLink: string): string {
  return `
    <table width="100%" cellpadding="0" cellspacing="0">
      <tr>
        <td align="center" style="padding: 24px;">
          <table width="480" cellpadding="0" cellspacing="0" style="font-family: Arial, sans-serif;">
            <tr>
              <td style="padding: 16px 0;">
                <h2>Recuperação de senha</h2>
                <p>Recebemos uma solicitação para redefinir sua senha. Clique no botão abaixo para continuar:</p>
              </td>
            </tr>
            <tr>
              <td align="center" style="padding: 16px 0;">
                <a href="${resetLink}" style="background:#2d6cdf;color:#fff;padding:12px 24px;border-radius:6px;text-decoration:none;">
                  Redefinir senha
                </a>
              </td>
            </tr>
            <tr>
              <td style="padding: 16px 0; color:#666; font-size:13px;">
                <p>Se você não solicitou isso, ignore este email. O link expira em 15 minutos.</p>
              </td>
            </tr>
          </table>
        </td>
      </tr>
    </table>
  `;
}