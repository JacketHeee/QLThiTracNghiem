import { describe, it, expect, vi } from "vitest";
import { render, screen } from "@/tests/utils/test-utils";
import { Input } from "@/components/atoms";

describe("Input Component", () => {
  it("renders input element", () => {
    render(<Input placeholder="Enter text" />);
    expect(screen.getByPlaceholderText("Enter text")).toBeInTheDocument();
  });

  it("applies correct input type", () => {
    render(<Input type="email" />);
    expect(screen.getByRole("textbox")).toHaveAttribute("type", "email");
  });

  it("handles value changes", async () => {
    const handleChange = vi.fn();
    const { user } = render(<Input onChange={handleChange} />);

    const input = screen.getByRole("textbox");
    await user.type(input, "test");

    expect(handleChange).toHaveBeenCalled();
  });
});
