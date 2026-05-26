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
    span.classList.add("letter");
    span.textContent = text[i];
    span.style.display = "inline-block";
    element.appendChild(span);
    chars.push(span);
  }

  return chars;
};

const TeamSection = () => {
  useEffect(() => {
    if (typeof window === "undefined") {
      return;
    }

    const profileImages = document.querySelectorAll<HTMLDivElement>(".profile-images .img");
    const nameElements = document.querySelectorAll<HTMLDivElement>(".profile-names .name");
    const nameHeadings = document.querySelectorAll<HTMLHeadingElement>(".profile-names .name h1");

    nameHeadings.forEach((heading) => {
      splitTextIntoChars(heading as HTMLElement);
    });

    const defaultName = document.querySelector<HTMLDivElement>(".name.default");
    const defaultLetters = defaultName ? defaultName.querySelectorAll<HTMLElement>(".letter") : [];

    if (defaultLetters.length) {
      gsap.set(defaultLetters, { y: "0%" });
    }

    const handlers: Array<{
      img: HTMLDivElement;
      enter: () => void;
      leave: () => void;
    }> = [];

    if (window.innerWidth > 900) {
      profileImages.forEach((img, index) => {
        const correspondingName = nameElements[index + 1];
        if (!correspondingName) return;
        const letters = correspondingName.querySelectorAll<HTMLElement>(".letter");
        gsap.set(letters, { y: "100%" });

        const enter = () => {
          gsap.to(img, { width: 140, height: 140, duration: 0.35, ease: "power4.out" });
          gsap.to(letters, {
            y: "-100%",
            duration: 0.8,
            ease: "power4.out",
            stagger: { each: 0.03, from: "center" },
          });
          if (defaultLetters.length) {
            gsap.to(defaultLetters, {
              y: "-150%",
              duration: 0.8,
              ease: "power4.out",
              stagger: { each: 0.03, from: "center" },
            });
          }
        };

        const leave = () => {
          gsap.to(img, { width: 70, height: 70, duration: 0.35, ease: "power4.out" });
          gsap.to(letters, {
            y: "100%",
            duration: 0.8,
            ease: "power4.out",
            stagger: { each: 0.03, from: "center" },
          });
          if (defaultLetters.length) {
            gsap.to(defaultLetters, {
              y: "0%",
              duration: 0.8,
              ease: "power4.out",
              stagger: { each: 0.03, from: "center" },
            });
          }
        };

        img.addEventListener("mouseenter", enter);
        img.addEventListener("mouseleave", leave);

        handlers.push({ img, enter, leave });
      });
    }

    return () => {
      handlers.forEach(({ img, enter, leave }) => {
        img.removeEventListener("mouseenter", enter);
        img.removeEventListener("mouseleave", leave);
      });
    };
  }, []);

  return (
    <section className="team">
      <div className="profile-images">
        <div className="img">
          <img src="/image1.jpeg" alt="Colin" />
        </div>
        <div className="img">
          <img src="/image2.jpeg" alt="Liam" />
        </div>
        <div className="img">
          <img src="/image3.jpeg" alt="Tabitha" />
        </div>
        <div className="img">
          <img src="/image4.jpeg" alt="Tyson" />
        </div>
        <div className="img">
          <img src="/image5.jpeg" alt="Max" />
        </div>
        <div className="img">
          <img src="/image6.jpeg" alt="Everest" />
        </div>
        <div className="img">
          <img src="/image7.jpeg" alt="Simon" />
        </div>
        <div className="img">
          <img src="/image8.jpeg" alt="Gideon" />
        </div>
        <div className="img">
          <img src="/image9.jpeg" alt="Benton" />
        </div>
      </div>

      <div className="profile-names">
        <div className="name default">
          <h1>The Geek</h1>
        </div>
        <div className="name">
          <h1>Anelka</h1>
        </div>
        <div className="name">
          <h1>Djodev</h1>
        </div>
        <div className="name">
          <h1>Greg</h1>
        </div>
        <div className="name">
          <h1>Yves</h1>
        </div>
        <div className="name">
          <h1>Pelagie</h1>
        </div>
        <div className="name">
          <h1>HK</h1>
        </div>
        <div className="name">
          <h1>Promesse</h1>
        </div>
        <div className="name">
          <h1>lucien</h1>
        </div>
        <div className="name">
          <h1>Big Man</h1>
        </div>
      </div>

      <style jsx global>{`
        @import url('https://fonts.googleapis.com/css2?family=Barlow+Condensed:wght@400;700;900&display=swap');

        .team {
          position: relative;
          width: 100%;
          min-height: 100vh;
          background-color: #f8eed4;
          color: #1f1f1e;
          display: flex;
          flex-direction: column;
          justify-content: center;
          align-items: center;
          gap: 2.5em;
          overflow: hidden;
          padding: 1.5rem;
          box-sizing: border-box;
        }

        .profile-images {
          width: min(100%, 560px);
          display: flex;
          justify-content: center;
          align-items: center;
          flex-wrap: wrap;
          gap: 1rem;
        }

        .img {
          position: relative;
          width: 70px;
          height: 70px;
          padding: 5px;
          cursor: pointer;
          will-change: width, height;
        }

        .img img {
          border-radius: 0.5rem;
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .profile-names {
          width: 100%;
          max-width: 100%;
          height: 20rem;
          clip-path: polygon(0 0, 100% 0, 100% 100%, 0% 100%);
          overflow: hidden;
          position: relative;
        }

        .name h1 {
          position: absolute;
          width: 100%;
          text-align: center;
          text-transform: uppercase;
          font-family: 'Barlow Condensed', sans-serif;
          font-size: clamp(3.5rem, 10vw, 20rem);
          font-weight: 900;
          letter-spacing: -0.5rem;
          line-height: 1;
          color: #f93535;
          user-select: none;
          transform: translateY(100%);
          margin: 0;
        }

        .name.default h1 {
          transform: translateY(0);
          color: #111111;
        }

        .name h1 .letter {
          position: relative;
          transform: translateY(0%);
          will-change: transform;
        }

        @media (max-width: 900px) {
          .team {
            flex-direction: column-reverse;
          }

          .profile-images {
            flex-wrap: wrap;
            max-width: 90%;
            justify-content: center;
          }

          .img {
            width: 60px;
            height: 60px;
            padding: 2.5px;
          }

          .name h1 {
            font-size: clamp(3rem, 11vw, 8rem);
            letter-spacing: 0;
          }

          .profile-names {
            height: 4rem;
          }
        }

        @media (max-width: 480px) {
          .team {
            gap: 1rem;
            padding: 1rem;
          }

          .profile-images {
            gap: 0.75rem;
          }

          .img {
            width: 48px;
            height: 48px;
            padding: 2px;
          }

          .name h1 {
            font-size: clamp(2.8rem, 14vw, 6rem);
            letter-spacing: 0;
          }

          .profile-names {
            height: 6rem;
          }
        }

        @media (max-width: 360px) {
          .profile-images {
            gap: 0.5rem;
          }

          .img {
            width: 42px;
            height: 42px;
          }

          .name h1 {
            font-size: clamp(2.4rem, 16vw, 5rem);
          }

          .profile-names {
            height: 5rem;
          }
        }
      `}</style>
    </section>
  );
};

export default TeamSection;
