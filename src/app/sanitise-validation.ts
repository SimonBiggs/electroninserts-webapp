export function validateInput(input: string): boolean {
  // return /^(-?\d*(\.\d+)?[,;\s]+)*-?\d*(\.\d+)?[,;\s]*$/.test(input)
  return /^[-\d\.,;\sNa]*$/.test(input)
}