export function validarNome(nome: string): string {
  const limpo = nome.trim();
  if (!limpo) throw new Error("O nome não pode ficar vazio");
  if (limpo.length > 80) throw new Error("O nome pode ter no máximo 80 caracteres");
  return limpo;
}
