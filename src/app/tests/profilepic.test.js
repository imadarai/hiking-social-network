import React from "react";
import ProfilePic from "../profilepic.js";
import {render, fireEvent} from "@testing-library/react";


test ('renders defautl image when there is no url prop', () => {
    const { container } = render(<ProfilePic />);
    expect(container.querySelector('img').src).toContain('/profilepic.png');
});


test ('renders image when a url prop is pased', () =>{
    const {container } = render(<ProfilePic url='/some-url.gif' />);
    expect(container.querySelector('img').src).toContain('/some-url.gif');
});

test ('renders alt tag with first and last props in alt', () =>{
    const {container } = render(<ProfilePic first='imad' last="arain" />);
    expect(container.querySelector('img').alt).toContain('imad arain');
});

test ('onClick prop gets called when img is clicked', () =>{
    const onClick = jest.fn();
    const {container } = render(<ProfilePic openUploader={onClick}/>);
    const img = container.querySelector('img');
    fireEvent.click(img);
    fireEvent.click(img);
    fireEvent.click(img);
    fireEvent.click(img);
    fireEvent.click(img);
    fireEvent.click(img);
    fireEvent.click(img);
    expect(onClick.mock.calls.length).toBe(7);
});
