import { describe, it, expect, vi } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import { Button } from "./primitives";

describe("Button", () => {
  it("renders its text and handles clicks", () => {
    const onClick = vi.fn();
    render(<Button variant="secondary" onClick={onClick}>Shop now</Button>);

    const button = screen.getByText("Shop now");
    expect(button).toBeInTheDocument();

    fireEvent.click(button);
    expect(onClick).toHaveBeenCalledTimes(1);
  });
});