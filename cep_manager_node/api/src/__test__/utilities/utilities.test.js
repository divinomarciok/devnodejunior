const {
  withoutCep,
  cepNoString,
  invalidCountCep,
  justNumbers,
  removeSpaces
} = require('../../utilities/utilities'); 

describe('Teste das funções de validação de CEP', () => {

  it('Deve retornar true se o CEP for nulo ou indefinido', () => {   
    expect(withoutCep(undefined)).toBe(true);
    expect(withoutCep('')).toBe(true);
    expect(withoutCep('12345678')).toBe(false);
  });

  it('Deve retornar true se o CEP não for uma string', () => {
    expect(cepNoString(12345678)).toBe(true);
    expect(cepNoString(null)).toBe(true);
    expect(cepNoString(undefined)).toBe(true);
    expect(cepNoString('12345678')).toBe(false);
  });

  it('Deve retornar true se o CEP não tiver 8 dígitos', () => {
    expect(invalidCountCep('1234567')).toBe(true);
    expect(invalidCountCep('123456789')).toBe(true);
    expect(invalidCountCep('12345678')).toBe(false);
  });

  it('Deve retornar true se o CEP contiver caracteres não numéricos', () => {
    expect(justNumbers('12345-67')).toBe(true);
    expect(justNumbers('ABC12345')).toBe(true);
    expect(justNumbers('12345678')).toBe(false);
  });

  it('Deve remover todos os espaços em branco de uma string', () => {
    const cepComEspacos = '75901 - 653';
    const cepSemEspacos = removeSpaces(cepComEspacos);
    expect(cepSemEspacos).toBe('75901-653');
  });

  it('Deve remover múltiplos espaços em branco entre os dígitos', () => {
    const cepComMultiplosEspacos = '75901   653';
    const cepSemMultiplosEspacos = removeSpaces(cepComMultiplosEspacos);
    expect(cepSemMultiplosEspacos).toBe('75901653');
  });

  it('Deve remover espaços em branco no início e no final da string', () => {
    const cepComEspacosExtremidades = ' 75901653 ';
    const cepSemEspacosExtremidades = removeSpaces(cepComEspacosExtremidades);
    expect(cepSemEspacosExtremidades).toBe('75901653');
  });

  it('Deve retornar a mesma string se não houver espaços em branco', () => {
    const cepSemEspacosOriginal = '12345678';
    const cepSemEspacosResultado = removeSpaces(cepSemEspacosOriginal);
    expect(cepSemEspacosResultado).toBe('12345678');
  });

  it('Deve retornar o valor original se não for uma string', () => {
    const naoStringNumero = 12345;
    expect(removeSpaces(naoStringNumero)).toBe(12345);
  });
  
});
