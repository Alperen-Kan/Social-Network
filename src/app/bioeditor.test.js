import React from "react";
import BioEditor from "./App";
import axios from "../axios";
import { render, waitForElement } from "@testing-library/react";

test('Add button is rendered when no bio is passed', () => {
    const { container } = render(<BioEditor />);

    console.log(container.querySelector('button'));
});
