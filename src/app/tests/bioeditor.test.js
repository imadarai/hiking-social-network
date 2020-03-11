// import React from "react";
// import BioEditor from "../BioEditor.js";
// import axios from "../axios";
// import {render, waitForElement} from "@testing-library/react";
//
// //automatic mock
// jest.mock("../axios");
//
// test ('app renders correctly', async () => {
//     axios.get.mockResolvedValue({
//         data: {
//             userId: 1,
//             first: "imad",
//             last: "arain",
//             url: "/arain.jpg"
//         }
//     });
//
//     const {container} = render (<BioEditor />);
//
//     await waitForElement(() => container.querySelector('div'));
//
//     console.log("innerHTML: ", container.innerHTML);
//
//     expect(container.innerHTML).toContain("<div>");
// });
