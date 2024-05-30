import { alpha } from "./"

describe("alpha function", () => {
  it("should handle short HEX input", () => {
    const input = "#F00"
    const opacity = 0.5
    const expected = "#FF000080"
    expect(alpha(input, opacity)).toBe(expected)
  })

  it("should handle HEX input", () => {
    const input = "#FF0000"
    const opacity = 0.5
    const expected = "#FF000080"
    expect(alpha(input, opacity)).toBe(expected)
  })

  it("should handle HEX input with alpha", () => {
    const input = "#ff000000"
    const opacity = 0.5
    const expected = "#ff000080"
    expect(alpha(input, opacity)).toBe(expected)
  })

  it("should handle RGB input", () => {
    const input = "rgb(255, 0, 0)"
    const opacity = 0.5
    const expected = "rgba(255, 0, 0, 0.5)"
    expect(alpha(input, opacity)).toBe(expected)
  })

  it("should handle RGBA input", () => {
    const input = "rgba(255, 0, 0, 0.12)"
    const opacity = 0.5
    const expected = "rgba(255, 0, 0, 0.5)"
    expect(alpha(input, opacity)).toBe(expected)
  })

  it("should throw error if input is not HEX or RGB", () => {
    const input = "not a color"
    const opacity = 0.5
    expect(() => alpha(input, opacity)).toThrow(new Error("Not a valid color"))
  })

  it("should throw error if alpha is bigger than 1 or lower than 0", () => {
    const input = "#FF0000"
    const opacity = 1.5
    expect(() => alpha(input, opacity)).toThrow(new Error("Alpha must be between 0 and 1"))
  })
})
