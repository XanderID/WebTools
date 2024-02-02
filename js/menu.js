const menuData = [
  {
    title: "Subnetting",
    content: "Subnet IP dan CIDR Kamu Secara Otomatis!",
    link: "subnetting",
  }
];

menuData.forEach(item => {
  const card = document.createElement("div");
  card.classList.add("card", "shadow", "mb-4");

  const cardHeader = document.createElement("div");
  cardHeader.classList.add("card-header", "py-3");
  const title = document.createElement("h6");
  title.classList.add("m-0", "font-weight-bold", "text-primary");
  title.textContent = item.title;
  cardHeader.appendChild(title);

  const cardBody = document.createElement("div");
  cardBody.classList.add("card-body");
  const content = document.createElement("p");
  content.innerHTML = item.content;
  cardBody.appendChild(content);

  const button = document.createElement("button");
  button.id = "usetool";
  button.classList.add("btn", "btn-primary");
  button.textContent = "Use the Tool";
  button.onclick = function () {
    window.location.href = "http://tools.mulqi.uk.to/tools/" + item.link;
  };
  cardBody.appendChild(button);

  card.appendChild(cardHeader);
  card.appendChild(cardBody);

  document.getElementById("menu").appendChild(card);
});