import React from "react";
import ProfilePic from "./ProfilePic";
import { render, fireEvent } from "@testing-library/react";

test('renders default image when there is no url prop', () => {
    const { container } = render(<ProfilePic />);
    // console.log(container.querySelector("img").src);
    expect(container.querySelector('img').src).toContain('/default.jpg');
});

test('renders image with specified url prop', () => {
    const { container } = render(<ProfilePic url='/some-url.gif' />);
    expect(container.querySelector('img').src).toContain('/some-url.gif');
});

test('renders image with first and last props in alt', () => {
    const { container } = render(<ProfilePic first='alperen' last='kan' />);
    expect(container.querySelector('img').alt).toContain('alperen kan');
});

test('openModal prop gets called when img is clicked', ()=> {
    const openUploader = jest.fn();
    const { container } = render(<ProfilePic openUploader={openUploader}/>);
    const img = container.querySelector('img');
    fireEvent.click(img);
    fireEvent.click(img);
    fireEvent.click(img);
    expect(
        openUploader.mock.calls.length
    ).toBe(3);
});
