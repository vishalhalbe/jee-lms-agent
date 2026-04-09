import { describe, it, expect } from "vitest"
import { parseLatexContent, hasBalancedBraces, stripLatexDelimiters } from "../math"

describe("parseLatexContent", () => {
  it("parses plain text", () => {
    const tokens = parseLatexContent("Hello world")
    expect(tokens).toEqual([{ type: "text", value: "Hello world" }])
  })

  it("parses inline math", () => {
    const tokens = parseLatexContent("Find $x^2$")
    expect(tokens).toContainEqual({ type: "math_inline", value: "x^2" })
  })

  it("parses display math", () => {
    const tokens = parseLatexContent("$$\\int x dx$$")
    expect(tokens).toContainEqual({ type: "math_display", value: "\\int x dx" })
  })

  it("parses image token", () => {
    const tokens = parseLatexContent("[img:https://example.com/fig.png]")
    expect(tokens).toContainEqual({ type: "image", url: "https://example.com/fig.png" })
  })

  it("handles mixed content", () => {
    const tokens = parseLatexContent("The value of $x$ is $$x^2+1$$")
    expect(tokens.some((t) => t.type === "math_inline")).toBe(true)
    expect(tokens.some((t) => t.type === "math_display")).toBe(true)
  })
})

describe("hasBalancedBraces", () => {
  it("returns true for balanced braces", () => {
    expect(hasBalancedBraces("\\frac{a}{b}")).toBe(true)
  })

  it("returns false for unbalanced braces", () => {
    expect(hasBalancedBraces("\\frac{a}{b")).toBe(false)
  })

  it("returns true for empty string", () => {
    expect(hasBalancedBraces("")).toBe(true)
  })
})

describe("stripLatexDelimiters", () => {
  it("strips inline math delimiters", () => {
    expect(stripLatexDelimiters("Find $x^2$")).toBe("Find x^2")
  })

  it("strips display math delimiters", () => {
    expect(stripLatexDelimiters("$$x+y=1$$")).toBe("x+y=1")
  })
})
