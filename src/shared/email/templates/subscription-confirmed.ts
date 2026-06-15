export function subscriptionConfirmedTemplate(name: string): string {
    return `
<!DOCTYPE html>
<html lang="pt-BR">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  <title>Inscrição confirmada — COEZMUC</title>
</head>
<body style="margin: 0; padding: 0; background-color: #F0E6D3; font-family: Arial, sans-serif;">
  <table width="100%" cellpadding="0" cellspacing="0" style="background-color: #F0E6D3; padding: 32px 16px;">
    <tr>
      <td align="center">
        <table width="560" cellpadding="0" cellspacing="0" style="max-width: 560px; width: 100%; background-color: #FAF7F2; border-radius: 16px; overflow: hidden; border: 1px solid #E8DDD0;">

          <!-- Header -->
          <tr>
            <td style="background-color: #3D2C1E; padding: 32px; text-align: center;">
              <p style="margin: 0 0 6px; font-size: 10px; letter-spacing: 0.25em; text-transform: uppercase; color: #D4A96A;">Confirmação de Inscrição</p>
              <p style="margin: 0; font-size: 11px; letter-spacing: 0.15em; text-transform: uppercase; color: #8C7355;">COEZMUC </p>
            </td>
          </tr>

          <!-- Body -->
          <tr>
            <td style="padding: 40px 32px;">
              <h1 style="font-family: Georgia, serif; font-size: 26px; font-weight: 400; color: #3D2C1E; text-align: center; margin: 0 0 8px;">Inscrição confirmada!</h1>
              <p style="font-size: 11px; letter-spacing: 0.1em; text-transform: uppercase; color: #B07D4A; text-align: center; margin: 0 0 32px;">Seja bem-vindo(a)</p>

              <p style="font-size: 15px; color: #3D2C1E; line-height: 1.7; margin: 0 0 24px; text-align: center;">
                Olá, <strong>${name}</strong>! Sua inscrição no COEZMUC 2027 foi confirmada. Estamos felizes em ter você conosco.
              </p>

              

              
              <p style="font-size: 14px; color: #5C4A36; line-height: 1.7; margin: 0 0 32px; text-align: center;">
                Acesse o regularmento abaixo e fique por dentro de todas as informações sobre o evento. 
                <br >
                Aguardamos você nos dias 06–10 de Fevereiro de 2027 na Escola Dr. Waldemar Neves da Rocha, Teófilo Otoni.</p>

              <!-- CTA -->
              <table width="100%" cellpadding="0" cellspacing="0">
                <tr>
                  <td align="center">
                    <a href="https://coezmuc.vercel.app/my-subscriptions" style="display: inline-block; background-color: #3D2C1E; color: #FAF7F2; font-size: 11px; letter-spacing: 0.2em; text-transform: uppercase; padding: 14px 32px; border-radius: 8px; text-decoration: none;">Regularmento</a>
                  </td>
                </tr>
              </table>
            </td>
          </tr>

          <!-- Footer -->
          <tr>
            <td style="background-color: #3D2C1E; padding: 24px; text-align: center;">
              <p style="margin: 0; font-size: 11px; letter-spacing: 0.1em; color: #8C7355;">Confraternização Espirita da Zona do Mucuri</p>
            </td>
          </tr>

        </table>
      </td>
    </tr>
  </table>
</body>`;
}