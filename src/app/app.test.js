import React from "react";
import App from "./App";
import axios from "../axios";
import { render, waitForElement } from "@testing-library/react";

jest.mock('../axios');

test('app renders correctly', async () => {
    axios.get.mockResolvedValue({
        data: {
            id: 1,
            first: "alperen",
            last: "kan",
            url: "/alp.jpg"
        }
    });

    const { container } = render(<App />);

    await waitForElement(() => container.querySelector('div'));

    // console.log("innerHTML:" ,container.innerHTML);

    expect(container.innerHTML).toContain("<div>");

});
