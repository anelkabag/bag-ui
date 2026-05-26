/* eslint-disable @next/next/no-img-element */

"use client";

import { useEffect } from "react";
import gsap from "gsap";

const splitTextIntoChars = (element: HTMLElement) => {
  const text = element.textContent || "";
  element.innerHTML = "";
  const chars: HTMLElement[] = [];

  for (let i = 0; i < text.length; i++) {
    const span = document.createElement("span");
    span.className = "letter";
    span.textContent = text[i];
    element.appendChild(span);
    chars.push(span);
  }

  return chars;
};

const members = [
  { name: "Anelka",   img: "https://api.dicebear.com/9.x/adventurer/svg?seed=Anelka&backgroundColor=ffd93d" },
  { name: "Djodev",   img: "https://api.dicebear.com/9.x/adventurer/svg?seed=Djodev&backgroundColor=6c63ff" },
  { name: "Greg",     img: "https://api.dicebear.com/9.x/adventurer/svg?seed=Greg&backgroundColor=e07a5f" },
  { name: "Yves",     img: "https://api.dicebear.com/9.x/adventurer/svg?seed=Yves&backgroundColor=81b29a" },
  { name: "Pelagie",  img: "https://api.dicebear.com/9.x/adventurer/svg?seed=Pelagie&backgroundColor=f2cc8f" },
  { name: "HK",       img: "https://api.dicebear.com/9.x/adventurer/svg?seed=HK&backgroundColor=3d405b" },
  { name: "Promesse", img: "https://api.dicebear.com/9.x/adventurer/svg?seed=Promesse&backgroundColor=e63946" },
  { name: "Lucien",   img: "https://api.dicebear.com/9.x/adventurer/svg?seed=Lucien&backgroundColor=457b9d" },
  { name: "Big Man",  img: "https://api.dicebear.com/9.x/adventurer/svg?seed=BigMan&backgroundColor=2d6a4f" },
];

const TeamSection = () => {
  useEffect(() => {
    if (typeof window === "undefined") return;

    const nameEls = document.querySelectorAll<HTMLDivElement>(".name[data-index]");
    const imgEls = document.querySelectorAll<HTMLDivElement>(".img[data-index]");
    const defaultName = document.querySelector<HTMLDivElement>(".name.default");

    nameEls.forEach((nameEl) => {
      const h1 = nameEl.querySelector("h1");
      if (h1) splitTextIntoChars(h1);
    });

    if (defaultName) {
      const h1 = defaultName.querySelector("h1");
      if (h1) splitTextIntoChars(h1);
    }

    const defaultLetters = defaultName
      ? defaultName.querySelectorAll<HTMLElement>(".letter")
      : [];

    gsap.set(defaultLetters, { y: "0%" });

    nameEls.forEach((nameEl) => {
      const letters = nameEl.querySelectorAll<HTMLElement>(".letter");
      gsap.set(letters, { y: "100%" });
    });

    const handlers: Array<{ img: HTMLDivElement; enter: () => void; leave: () => void }> = [];

    imgEls.forEach((imgEl) => {
      const idx = imgEl.getAttribute("data-index");
      const nameEl = document.querySelector<HTMLDivElement>(`.name[data-index="${idx}"]`);
      if (!nameEl) return;

      const letters = nameEl.querySelectorAll<HTMLElement>(".letter");

      const enter = () => {
        gsap.to(letters, {
          y: "-100%",
          duration: 0.7,
          ease: "power4.out",
          stagger: { each: 0.03, from: "center" },
        });
        gsap.to(defaultLetters, {
          y: "-150%",
          duration: 0.7,
          ease: "power4.out",
          stagger: { each: 0.03, from: "center" },
        });
      };

      const leave = () => {
        gsap.to(letters, {
          y: "100%",
          duration: 0.7,
          ease: "power4.out",
          stagger: { each: 0.03, from: "center" },
        });
        gsap.to(defaultLetters, {
          y: "0%",
          duration: 0.7,
          ease: "power4.out",
          stagger: { each: 0.03, from: "center" },
        });
      };

      imgEl.addEventListener("mouseenter", enter);
      imgEl.addEventListener("mouseleave", leave);
      handlers.push({ img: imgEl, enter, leave });
    });

    return () => {
      handlers.forEach(({ img, enter, leave }) => {
        img.removeEventListener("mouseenter", enter);
        img.removeEventListener("mouseleave", leave);
      });
    };
  }, []);

  return (
    <section className="team">
      <div className="profile-names">
        <div className="name default">
          <h1>The Geek</h1>
        </div>
        {members.map((m, i) => (
          <div className="name" data-index={i} key={m.name}>
            <h1>{m.name}</h1>
          </div>
        ))}
      </div>

      <div className="profile-images">
        {members.map((m, i) => (
          <div className="img" data-index={i} key={m.name}>
            <img src={m.img} alt={m.name} />
          </div>
        ))}
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@900&display=swap');

        .team {
          position: relative;
          width: 100%;
          height: 100%;
          min-height: unset;
          background-color: #ffffff;
          color: #1f1f1e;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 1rem;
          padding: 1rem;
          box-sizing: border-box;
          overflow: hidden;
        }

        .profile-names {
          width: 100%;
          height: clamp(2.5rem, 20%, 7rem);
          overflow: hidden;
          position: relative;
          clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
        }

        .name h1 {
          position: absolute;
          width: 100%;
          text-align: center;
          text-transform: uppercase;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(2rem, 7%, 7rem);
          font-weight: 900;
          letter-spacing: -0.03em;
          line-height: 1;
          color: #f93535;
          user-select: none;
          transform: translateY(100%);
          margin: 0;
        }

        .name.default h1 {
          transform: translateY(0%);
          color: #111111;
        }

        .name h1 .letter {
          display: inline-block;
          will-change: transform;
        }

        .profile-images {
          display: flex;
          flex-wrap: wrap;
          justify-content: center;
          align-items: center;
          gap: 0.5rem;
          width: 100%;
          max-width: 100%;
        }

        .img {
          width: clamp(36px, 8%, 64px);
          height: clamp(36px, 8%, 64px);
          cursor: pointer;
          will-change: width, height;
          transition: width 0.35s cubic-bezier(0.19, 1, 0.22, 1),
                      height 0.35s cubic-bezier(0.19, 1, 0.22, 1);
          flex-shrink: 0;
        }

        .img:hover {
          width: clamp(54px, 12%, 96px);
          height: clamp(54px, 12%, 96px);
        }

        .img img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          border-radius: 0.5rem;
          display: block;
        }
      `}</style>
    </section>
  );
};

export default TeamSection;