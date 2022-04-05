const title = document.createElement("h1");
title.textContent = "Understanding TypeScript - Section 6 Advanced Types";

const input = document.createElement("input");
input.setAttribute("type", "email");
input.id = "user-input";
input.setAttribute("name", "email");
input.style.cssText = `
  padding: .4rem .8rem;
  font-size: 16px;
`;

document.getElementById("root")?.appendChild(title);
document.getElementById("root")?.appendChild(input);
