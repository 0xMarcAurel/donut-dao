const openButton = document.getElementById("open-sidebar-button");
const navbar = document.getElementById("navbar");
const media = window.matchMedia("(width < 700px)");
const footer = document.querySelector("footer");
const footerHeight = footer.offsetHeight;
const starContainer = document.querySelector(".star-container");

// navbar

media.addEventListener("change", (e) => updateNavbar(e));

function updateNavbar(e) {
  const isMobile = e.matches;
  console.log(isMobile);
  if (isMobile) {
    navbar.setAttribute("inert", "");
  } else {
    navbar.removeAttribute("inert");
  }
}

function openSidebar() {
  navbar.classList.add("show");
  openButton.setAttribute("aria-expanded", "true");
  navbar.removeAttribute("inert");
}

function closeSidebar() {
  navbar.classList.remove("show");
  openButton.setAttribute("aria-expanded", "false");
  navbar.setAttribute("inert", "");
}

updateNavbar(media);

// space fx

starContainer.style.setProperty("--footer-height", `${footerHeight}px`);

const numberOfStars = 50;

for (let i = 0; i < numberOfStars; i++) {
  const star = document.createElement("div");
  star.classList.add("star");

  const size = Math.random() * 3 + 1;
  star.style.width = `${size}px`;
  star.style.height = `${size}px`;

  const x = Math.random() * 100;
  star.style.left = `${x}%`;

  star.style.bottom = `-${size}px`;

  const duration = Math.random() * 13 + 20;
  star.style.animation = `moveUp ${duration}s linear infinite`;

  const delay = Math.random() * 5;
  star.style.animationDelay = `-${delay}s`;

  starContainer.appendChild(star);
}

// fade-in + unblur fx

const elements = document.querySelectorAll(".fade-in");

const observer = new IntersectionObserver(
  (entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("in-view");
      } else {
        entry.target.classList.remove("in-view");
      }
    });
  },
  {
    threshold: 0.1,
  }
);

elements.forEach((element) => {
  observer.observe(element);
});

// registration UI
const registerForm = document.querySelector(".register-form");
let registeredWallets = [];
let registeredUsernames = [];

// fetch data from donut-bot repo
async function registeredUsers() {
  try {
    const response = await fetch(
      "https://raw.githubusercontent.com/EthTrader/donut.distribution/refs/heads/main/docs/users.json"
    );
    const users = await response.json();

    registeredWallets = Object.values(users).map((user) =>
      user.address.toLowerCase()
    );
    registeredUsernames = Object.values(users).map((user) =>
      user.username.toLowerCase()
    );
  } catch (error) {
    console.error("Failed to load user data:", error);
  }
}

registeredUsers();

if (registerForm) {
  registerForm.addEventListener("submit", async function (event) {
    event.preventDefault();

    const address = document.getElementById("wallet").value.trim();
    const username = document.getElementById("username").value.trim();
    const comment = document.getElementById("form-comment");
    const registerButton = document.querySelector(".register-btn");

    const inputLength = address.length;
    const startWith0x = /^0x/.test(address);
    const exclude0x = address.slice(2);
    const onlyNumbers = /^[0-9]+$/.test(exclude0x);
    const onlyLetters = /^[a-fA-F]+$/.test(exclude0x);
    const validChars = /^[0-9a-fA-F]+$/.test(exclude0x);
    const balancedLetterCount = (exclude0x.match(/[a-fA-F]/g) || []).length;
    const balancedNumberCount = (exclude0x.match(/[0-9]/g) || []).length;
    const validCharsUser = /^[a-zA-Z0-9_-]+$/.test(username);
    const usernameHasSpaces = /\s/.test(username);

    comment.style.color = "";

    // username validation
    if (!username) {
      comment.textContent = "Please insert a username.";
      return;
    }

    if (username.length < 3 || username.length > 20) {
      comment.textContent = "Invalid username.";
      return;
    }

    if (usernameHasSpaces) {
      comment.textContent = "Invalid username.";
      return;
    }

    if (!validCharsUser) {
      comment.textContent = "Invalid username.";
      return;
    }

    if (registeredUsernames.includes(username.toLowerCase())) {
      comment.textContent = "This user is already registered.";
      return;
    }

    // wallet validation
    if (!address) {
      comment.textContent = "Please insert an address.";
      return;
    }

    if (!startWith0x) {
      comment.textContent = "Invalid address.";
      return;
    }

    if (inputLength !== 42) {
      comment.textContent = "Invalid address.";
      return;
    }

    if (!validChars) {
      comment.textContent = "Invalid address.";
      return;
    }

    if (onlyNumbers || onlyLetters) {
      comment.textContent = "Invalid address.";
      return;
    }

    if (balancedLetterCount < 4 || balancedNumberCount < 4) {
      comment.textContent = "Invalid address.";
      return;
    }

    if (registeredWallets.includes(address.toLowerCase())) {
      comment.textContent = "This wallet has already been registered.";
      return;
    }

    // if registration is successful
    try {
      const response = await fetch("/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ username, wallet: address }),
      });

      const data = await response.json();

      if (!response.ok) {
        comment.style.color = "rgb(255, 26, 14)";
        comment.textContent = data.error;
        return;
      }

      comment.style.color = "rgb(48, 192, 50)";
      comment.textContent = `${username}, you have successfully registered on r/EthTrader!`;
      registerForm.reset();
      registerButton.textContent = "Success!";
      registerButton.disabled = true;
    } catch (error) {
      comment.style.color = "rgb(255, 26, 14)";
      comment.textContent = "Server error, please try again.";
    }
  });
}

// fetch burned donuts from Arbitrum One

async function fetchBurnedDonuts() {
  try {
    const burnedTokens = document.getElementById("burned");
    const burnedMainnet = 111498; // Donuts burned on mainnet
    const response = await fetch(
      "https://api.etherscan.io/v2/api?chainid=42161&module=account&action=tokenbalance&contractaddress=0xF42e2B8bc2aF8B110b65be98dB1321B1ab8D44f5&address=0x000000000000000000000000000000000000dEaD&tag=latest&apikey=YQ21BRKWFTG1N7JNRQPHV1KQWDCQZCSQX5"
    );

    if (!response.ok) {
      throw new Error("Could not fetch data");
    }

    const data = await response.json();

    console.log(data);

    if (data.status !== "1") {
      throw new Error(data.result);
    }

    const rawBalance = BigInt(data.result);
    const readableBalance = Number(rawBalance) / 1e18;

    console.log(readableBalance + " Donuts burned on Arbitrum One.");

    const totalBurned = burnedMainnet + readableBalance;
    const displayM = totalBurned / 1e6;

    burnedTokens.textContent =
      displayM.toLocaleString("en-US", {
        minimumFractionDigits: 1,
        maximumFractionDigits: 1,
      }) + "M+";
  } catch (error) {
    console.error("Error fetching data:", error.message || error);
    burnedTokens.textContent = "Error";
  }
}

fetchBurnedDonuts();
