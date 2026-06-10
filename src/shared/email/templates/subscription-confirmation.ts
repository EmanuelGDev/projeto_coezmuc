export function subscriptionConfirmationTemplate(name: string): string {
  return `
    <h1>Inscrição confirmada!</h1>
    <p>Olá, ${name}! Sua inscrição foi realizada com sucesso.</p>
  `;
}