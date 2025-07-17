import { describe, it, expect } from 'vitest';
import calculateTotalAmounts from './calculateTotalAmount';

describe('calculateTotalAmounts', () => {
  it("should work with basic cases", () => {
    expect(calculateTotalAmounts("100\n200")).toBe("300")
    expect(calculateTotalAmounts("100, 200, 300")).toBe("600")
  })
  
  it('returns "0" for an empty string', () => {
    expect(calculateTotalAmounts("")).toBe("0")
  })

  it('returns the same value for a single valid number string', () => {
    expect(calculateTotalAmounts("42")).toBe("42")
  })

  it('returns "0" for a single non-numeric value', () => {
    expect(calculateTotalAmounts("abc")).toBe("0")
  })

  it('sums comma-separated numbers', () => {
    expect(calculateTotalAmounts("10,20,30")).toBe("60")
  })

  it('sums newline-separated numbers', () => {
    expect(calculateTotalAmounts("5\n15\n25")).toBe("45")
  })

  it('sums mixed comma and newline-separated numbers', () => {
    expect(calculateTotalAmounts("1,2\n3,4\n5")).toBe("15")
  })

  it('trims whitespace and filters out empty segments', () => {
    expect(calculateTotalAmounts(" 1 , \n 2 , , 3 \n ")).toBe("6")
  })

  it('returns "0" if any invalid number is encountered', () => {
    expect(calculateTotalAmounts("5,abc,10")).toBe("0")
  })

  it('correctly handles negative numbers', () => {
    expect(calculateTotalAmounts("-5,-10,15")).toBe("0")
  })

  it('returns "0" for only non-numeric inputs', () => {
    expect(calculateTotalAmounts("hello,world")).toBe("0")
  })
})
